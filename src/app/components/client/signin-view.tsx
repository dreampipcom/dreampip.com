// signin-view.ts
"use client";
import { useContext, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { AuthContext } from "@state";
import { ALogIn, ALogOut } from "@actions";
import { navigate } from "@gateway";

interface IAuthProvider {
  id?: string;
  name?: string;
}

interface VSignInProps {
  providers: IAuthProvider[];
}

async function doSignOut() {
  await signOut();
}

export const VSignIn = ({ providers, user }: VSignInProps) => {
  const authContext = useContext(AuthContext);
  const { data: session } = useSession();
  const [isUserLoaded, loadUser] = ALogIn({});
  const [, unloadUser] = ALogOut({});
  const initd = useRef(false);

  const { authd, name } = authContext;


  /* server/client isomorphism */
  const coercedName = name || user?.name || user?.email

  useEffect(() => {
    if (!isUserLoaded && session?.user && !initd.current) {
      loadUser({
        authd: true,
        name: session.user.name,
        avatar: session.user.image,
        email: session.user.email,
      });
      initd.current = true;
    }
  }, [session, isUserLoaded, loadUser]);

  const handleSignOut = async () => {
    unloadUser();
    await doSignOut();
  };

  if (!providers) return;

  if (user || authd)
    return (
      <span>
        Welcome, {coercedName} <button onClick={handleSignOut}>Sign out</button>
      </span>
    );

  return <button onClick={() => navigate("/api/auth/signin")}>Sign in</button>
}

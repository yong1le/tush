import { signIn } from "~/server/auth";

export default async function Home() {
  const signInGithub = async () => {
    "use server";
    await signIn("github");
  };
  return (
    <div>
      <form action={signInGithub}>
        <button type="submit">Signin</button>
      </form>
    </div>
  );
}

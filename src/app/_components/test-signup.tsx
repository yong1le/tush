import { authClient } from "~/app/_lib/auth-client";

export default async function SignUp() {
  const email = "yonggoy912@gmail.com";
  const password = "password";
  const name = "Yong Le";

  const signUp = async () => {
    "use server";

    const { data, error } = await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {},
    );

    if (error) {
      console.log(error);
    }

    console.log(data);
  };

  return (
    <div>
      <div>Hello world</div>
      <form action={signUp}>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

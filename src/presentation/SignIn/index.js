import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import * as React from "react";
import {useLogin} from "../../hooks/useLogin";
import GitHubIcon from "@mui/icons-material/GitHub";

const SignIn = () => {
    const {login, isPending} = useLogin();
    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">

                TinkerWall

                <div
                    className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-center p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">Tinker
                            wall</h1>
                        <form className="space-y-4 md:space-y-6" action="#">

                            <button
                                type="submit"
                                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="outlined"
                                        onClick={login}
                                        startIcon={<GitHubIcon/>}
                                    >
                                        {isPending ? "Loading..." : "Sign In With Github"}
                                    </Button>
                                </Stack>
                            </button>

                        </form>
                    </div>
                </div>
            </div>
        </section>

        // <div className="App">
        //   <button className="btn" onClick={login}>
        //     {isPending ? "Loading..." : "Login With Github"}
        //   </button>
        //   <button className="btn">Log Out</button>
        // </div>
    );
};

export default SignIn;

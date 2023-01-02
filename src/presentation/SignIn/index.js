import Stack from "@mui/material/Stack";
import * as React from "react";
import {useLogin} from "../../hooks/useLogin";
import GitHubIcon from "@mui/icons-material/GitHub";
import "./style.css";

function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j === 1 && k !== 11) {
        return  "st";
    }
    if (j === 2 && k !== 12) {
        return  "nd";
    }
    if (j === 3 && k !== 13) {
        return "rd";
    }
    return  "th";
}

const SignIn = () => {

    // logen in  state
    const {login, isPending, rank, user} = useLogin();
    return !rank ? (

            <div>

                <div className="wrapper">
                    <div className="clash-card barbarian">
                        <div className="clash-card__image clash-card__image--barbarian">
                            {/*github url*/}
                            <img src="https://www.tinkerhub.org/files/LogoBLACK.png"
                                 alt="github"/>
                        </div>

                        <div className="clash-card__unit-name">Welcome to TinkerSpace!
                        </div>
                        <div className="clash-card__unit-description">


                            Thank you for choosing TinkerSpace for your learning and discovery needs. We hope you have a
                            great time exploring all that we have to offer. If you have any questions or need help, don't
                            hesitate to reach out to us.

                            Happy tinkering!
                        </div>
                        <div className="clash-card__level clash-card__level--barbarian">Level 4</div>
                        <button onClick={login}
                                className="clash-card__unit-stats clash-card__unit-stats--barbarian clearfix">
                            {isPending ? "Loading..." : "Sign in with GitHub"}
                        </button>

                    </div>

                </div>

            </div>
        ) :
        (
            <div>

                <div className="wrapper">
                    <div className="clash-card barbarian">
                        <div className="clash-card__image clash-card__image--barbarian">
                            <img src={user.photoURL} alt={user.displayName}/>
                        </div>

                        <div className="clash-card__unit-name"><span
                            className="little-text">Hi </span> {user.displayName}
                        </div>
                        <div className="clash-card__unit-description">
                            Congratulations, on coming to TinkerSpace!hope you have a great time and learn a lot
                            of new things while you're there. If you have any questions or need any assistance, don't
                            hesitate to ask. Enjoy your time at TinkerSpace!
                        </div>
                        <div className="clash-card__unit-stats clash-card__unit-stats--barbarian clearfix">
                            your are the {rank} <span className="little-text">{ordinal_suffix_of(rank)}</span> user joining TinkerSpace
                        </div>

                    </div>

                </div>

            </div>

        );

};

export default SignIn;

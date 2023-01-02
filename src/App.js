import {useLogin} from "./hooks/userLogin";


const App = () => {
    const {login, isPending} = useLogin();
    return (
        <div className="App">
            <button className="btn" onClick={login}>
                {isPending ? "Loading..." : "Login With Github"}
            </button>
            <button className="btn">
                Log Out
            </button>
        </div>
    );
};

export default App;

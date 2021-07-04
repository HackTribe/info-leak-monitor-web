import { Redirect, Route, Switch } from "react-router-dom";
import Admin from "./pages/admin/admin";
import Login from "./pages/login/login";

function App() {
    return (
        <div className="app">
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/admin" component={Admin} />
                <Redirect to="/login" />
            </Switch>
        </div>
    );
}

export default App;

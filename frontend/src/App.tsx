import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import { routeConfig } from "./config/routeConfig.tsx";
import { useAuthListener } from "./hooks/useAuthListener.ts";

function AppRoutes() {
    // Setup auth listeners inside Router context
    useAuthListener();

    const routes = useRoutes(routeConfig);
    return routes;
}

function App() {
    return (
        <Router>
            <AppRoutes />
        </Router>
    );
}

export default App;

import {
    Links,
    LiveReload,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
    useLoaderData,
    createCookieSessionStorage,
} from "remix";

/* Theming */
import { createThemeSessionResolver, ThemeProvider, useTheme, PreventFlashOnWrongTheme } from "remix-themes";

const sessionStorage = createCookieSessionStorage({
    cookie: {
        name: 'remix-themes',
        secure: true,
        sameSite: 'lax',
        secrets: ['s3cr3t'],
        path: '/',
        httpOnly: true,
    },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)

export const loader = async ({ request }) => {
    const { getTheme } = await themeSessionResolver(request)
    return {
        theme: getTheme(),
    }
}

export default function AppWithProviders() {
    const data = useLoaderData()
    return (
        <ThemeProvider specifiedTheme={data.theme} themeAction="action/set-theme">
            <App />
        </ThemeProvider>
    )
}

/* TailwindCSS */
import styles from "./styles/app.css"

export function links() {
    return [{ rel: "stylesheet", href: styles }]
}

/* create-remix */
export function meta() {
    return { title: "New Remix App" };
}

function App() {
    const data = useLoaderData();
    const [theme] = useTheme();
    return (
        <html lang="en" className={theme ? theme : ''}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width,initial-scale=1" />
                <Meta />
                <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
                <Links />
            </head>
            <body>
                <Outlet />
                <ScrollRestoration />
                <Scripts />
                <LiveReload />
            </body>
        </html>
    );
}

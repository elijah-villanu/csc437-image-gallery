import "./Header.css";

export function Header() {
    return (
        <header>
            <h1>My cool image site</h1>
            <div>
                <label>
                    Some switch (dark mode?) <input type="checkbox" />
                </label>
                <nav>
                    <a href="/">Home</a>
                    <a href="/upload">Upload</a>
                    <a href="/login">Log in</a>
                </nav>
            </div>
        </header>
    );
}

const { useState } = React;

function App() {
    const [decade, setDecade] = useState('');
    const [result, setResult] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/api/artists/multiple-genres?decade=${decade}`);
            const data = await response.json();
            setResult(data.artistCount);
        } catch (error) {
            console.error('Error fetching data:', error);
            setResult('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Artists with Multiple Genres</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="decade">Enter Decade (e.g., 1980): </label>
                <input
                    type="number"
                    id="decade"
                    value={decade}
                    onChange={(e) => setDecade(e.target.value)}
                    required
                />
                <button type="submit">Submit</button>
            </form>
            {result !== null && (
                <div>
                    <h2>Results</h2>
                    <p>Artists with multiple genres in {decade}: {result}</p>
                </div>
            )}
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

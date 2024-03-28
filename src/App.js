import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

//------COUNTER FUNCTION EXAMPLE---------
// function Counter() {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <span style={{ fontSize: "40px" }}> {count} </span>
//       <button className="btn btn-large" onClick={() => setCount(count + 1)}>
//         +1
//       </button>
//     </div>
//   );
// }

function App() {
  // define state variable
  const [facts, setFacts] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [currentCategory, setCurrentCategory] = useState("all");

  useEffect(
    function () {
      async function getFacts() {
        setIsLoading(true);

        let query = supabase.from("fact").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: fact, error } = await query.order("text", {
          ascending: true,
        });

        console.log(error);

        console.log(fact);
        if (!error) {
          setFacts(fact);
          setIsLoading(false);
        } else alert("There was a problem getting data");

        // setFacts(fact);
      }
      getFacts();
    },
    [currentCategory]
  );
  return (
    <>
      {/* HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />
      {/* use state variable */}
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}
      {/* <NewFactForm /> */}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />

        {isLoading ? (
          <Loader />
        ) : (
          <FactsList facts={facts} setFacts={setFacts} />
        )}
        {/* <Counter /> */}

        {/* <FactsList facts={facts} /> */}
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ showForm, setShowForm }) {
  const appTitle = "today i learned";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="" />
        <h1>{appTitle}</h1>
      </div>
      <button
        className="btn btn-large btn-open"
        // update state variable
        onClick={() => setShowForm((showForm) => !showForm)}
      >
        {showForm ? "Close" : "Share a fact"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  console.log("inside the function", text);

  async function handleSubmit(e) {
    //1. prevent browser reload

    e.preventDefault();
    console.log(text, source, category);

    //2. check if data is valid. if so create new fact
    if (
      text &&
      source &&
      category &&
      text.length <= 200 &&
      isValidUrl(source)
    ) {
      console.log("text is valid");

      //3. Upload fact to supabase
      //new fact object
      setIsUploading(true);
      const { data: newFact, error } = await supabase
        .from("fact")
        .insert([{ text, source, category }])
        .select();
      setIsUploading(false);
      console.log(newFact);

      //4. Add new fact to the UI. Appending the new value to the old value
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      //5. Reset input fields
      setCategory("");
      setText("");
      setSource("");
      //6. close the form
      setShowForm(false);
    }
  }

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <input
        type="text"
        placeholder="Trustworthy source.."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCategory }) {
  // console.log("rendering....");
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            onClick={() => setCurrentCategory("all")}
            className="btn btn-all-categories"
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              onClick={() => setCurrentCategory(cat.name)}
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactsList({ facts, setFacts }) {
  // const facts = initialFacts;
  if (facts.length === 0) {
    return (
      <p className="message">
        {" "}
        No Facts for this Category yet! Create the first one
      </p>
    );
  }
  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database. Add your own</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed =
    fact.votesInteresting + fact.votesMindBlowing < fact.votesFalse;

  async function handleVote(columnName) {
    setIsUpdating(true);
    const { data: updatedFact, error } = await supabase
      .from("fact")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    setIsUpdating(false);

    console.log(updatedFact);
    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updatedFact[0] : f))
      );
  }

  return (
    <li key={fact.id} className="fact">
      <p>
        {isDisputed ? <span className="disputed">[❌DISPUTED❌]</span> : null}
        {fact.text}
        <a className="source" href={fact.source}>
          (Source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name == fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>

      <div className="vote-buttons">
        <button
          onClick={() => handleVote("votesInteresting")}
          disabled={isUpdating}
        >
          👍 {fact.votesInteresting}
        </button>
        <button
          onClick={() => handleVote("votesMindBlowing")}
          disabled={isUpdating}
        >
          🤯 {fact.votesMindBlowing}
        </button>
        <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>
          ⛔️ {fact.votesFalse}
        </button>
        {console.log("votes for mindblowing facts:", fact.votesMindblowing)}
      </div>
    </li>
  );
}

export default App;

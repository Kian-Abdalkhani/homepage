import "./App.css";
import { Header } from "./components/Header";
import { LinkList } from "./components/LinkList";
import { About } from "./components/About";

function App() {
  return (
    <>
      <Header />
      <main>
        <About />
        <LinkList />
      </main>
    </>
  );
}

export default App;

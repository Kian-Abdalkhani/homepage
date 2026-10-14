import { Grid } from "@abdalkhani/react-ui";
import "./App.css";
import { Header } from "./components/Header";
import { LinkList } from "./components/LinkList";
import { About } from "./components/About";

function App() {
  return (
    <>
      <Header />
      <main className="homepage-main">
        <Grid className="homepage-grid" columns="var(--homepage-columns)" gap="var(--ak-space-6)">
          <About />
          <LinkList />
        </Grid>
      </main>
    </>
  );
}

export default App;

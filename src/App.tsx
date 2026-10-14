import { Button, Stack } from "@abdalkhani/react-ui";
import "./App.css";
import { Header } from "./components/Header";
import { LinkList } from "./components/LinkList";
import { About } from "./components/About";
import { useAppearance } from "./hooks/useAppearance";

function App() {
  const { appearance, followsSystem, toggleAppearance, resetAppearance } = useAppearance();

  return (
    <>
      <Header appearance={appearance} toggleAppearance={toggleAppearance} />
      <main className="homepage-main">
        <Stack gap="var(--ak-space-6)">
          <LinkList />
          <About />
          <Stack className="appearance-preferences" direction="row" align="center" justify="space-between" wrap gap="var(--ak-space-2)">
            <p>{followsSystem ? "Appearance follows your device." : `${appearance === "dark" ? "Dark" : "Light"} appearance selected.`}</p>
            <Button variant="quiet" size="compact" onClick={resetAppearance} disabled={followsSystem}>Follow system</Button>
          </Stack>
        </Stack>
      </main>
    </>
  );
}

export default App;

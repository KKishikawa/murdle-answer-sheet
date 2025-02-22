import { Layout } from "@/components/layout";
import { ImageSelector } from "@/components/page/image-selector";
import { ThemeProvider } from "@/components/provider/theme-provider";

function App() {
  return (
    <ThemeProvider>
      <Layout>
        <ImageSelector />
      </Layout>
    </ThemeProvider>
  );
}

export default App;

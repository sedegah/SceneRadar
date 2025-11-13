import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Bookmarks from "@/pages/Bookmarks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MovieModal } from "@/components/MovieModal";

function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/bookmarks" component={Bookmarks} />
        <Route component={NotFound} />
      </Switch>
      <Footer />
      <MovieModal />
      <Toaster />
    </>
  );
}

export default App;

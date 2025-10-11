import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import { MetaProvider, Title } from "@solidjs/meta";

import { Layout } from "./components/layout.jsx"

import Home from "./pages/index.jsx";
import CreateEvent from "./pages/createevent.jsx";
import EditEvent from "./pages/editevent.jsx";
import ListEvents from "./pages/listevents.jsx";
import Event from "./pages/event.jsx";
import { BackButton } from "./components/utils.jsx";

function Page404() {
  return (
    <Layout center={true}>
      <MetaProvider>
        <Title>Nénuph'art - Oupsss ?</Title>
      </MetaProvider>

      <BackButton/>

      <div class="text-xl">
        404 - Je croâ que ton URL a un problème :(
      </div>
    </Layout>
  );
}

render(
  () => (
    <Router>
      <Route path="/" component={Home} />
      <Route path="/createevent" component={CreateEvent} />
      <Route path="/event/:id" component={Event} />
      <Route path="/editevent/:id" component={EditEvent} />
      <Route path="/listevents" component={ListEvents} />
      <Route path="*paramName" component={Page404} />
    </Router>
  ),
  document.getElementById("app")
);
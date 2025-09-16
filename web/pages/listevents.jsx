import { createResource, For, Match, Show, Switch } from "solid-js";
import { MetaProvider, Title } from "@solidjs/meta";
import { Layout } from "../components/layout";
import { BackButton, Link, LinkButton, mds } from "../components/utils";
import { Icon } from "../components/icons";

async function fetchEvents() {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Impossible de récupérer les événements");
  return await res.json();
}

export default function ListEventsPage() {
  const [events] = createResource(fetchEvents);

  return (
    <Layout center={true}>
      <MetaProvider>
        <Title>BDA - Evenements à venir</Title>
      </MetaProvider>
      <div class="mb-4">
        <BackButton/>
        <h2 class="text-2xl font-bold">Liste des événements à venir</h2>
        <LinkButton href="/createevent">Créer un événement (admin only)</LinkButton>
      </div>
      
      <Show when={events.loading}>
        <div>Chargement...</div>
      </Show>
      <Show when={events.error}>
        <div>Erreur : {events.error.message}</div>
      </Show>
      <Show when={events() && events().length > 0} fallback={<div>Aucun événement pour le moment.</div>}>
        <div class="flex flex-col gap-4">
          <For each={events()}>
            {ev => (
              <Link href={`/event/${ev.id}`} classList={{
                "block": true,
                "rounded": true,
                "shadow": true,
                "p-4": true,
                "bg-yellow-100": new Date(ev.paps) > new Date(),
                "bg-rc": new Date(ev.paps) <= new Date() && ev.places <= 0,
                "bg-white": new Date(ev.paps) <= new Date() && ev.places > 0,
              }}>
                <div class="font-bold text-lg">{ev.name}</div>
                <div class="text-gray-700 flex flex-row items-center gap-1">
                  <Icon type="location-dot" size={1}/>
                  {ev.location}
                  <span>{mds}</span>
                  <Icon type="calendar-week" size={1}/>
                  {new Date(ev.date).toLocaleString()}</div>
                <div class="text-gray-600 flex flex-row">
                  {ev.participants} places
                  {mds}
                  <Switch>
                    <Match when={new Date(ev.paps) > new Date()}>Ouverture du PAPS le {new Date(ev.paps).toLocaleString()}</Match>
                    <Match when={ev.places > 0}>{ev.places} restantes</Match>
                    <Match when={ev.places <= 0}>Complet</Match>
                  </Switch>
                </div>
                <Show when={ev.description}>
                  <div class="text-sm mt-2">{ev.description}</div>
                </Show>
              </Link>
            )}
          </For>
        </div>
      </Show>
    </Layout>
  );
}
import { createEffect, createResource, createSignal, For, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { MetaProvider, Title } from "@solidjs/meta";
import { Layout } from "../components/layout";

import { users } from "../res/users";
import { BackButton, LinkButton } from "../components/utils";
import { Icon } from "../components/icons";


export const [ token, setToken ] = createSignal(localStorage.getItem("token"));
createEffect(() => {
  localStorage.setItem("token", token());
})

export async function fetchEvent(id) {
  const headers = {};
  if (token()) headers.authorization = token();
  const res = await fetch(`/api/event/${id}`, { headers });
  if (!res.ok) throw new Error("Événement introuvable");
  const json = await res.json();
  if (json.token) setToken(json.token);
  return json;
}

export default function EventPage() {
  const params = useParams();
  const [ev, { mutate, refetch }] = createResource(params.id, fetchEvent);
  const [pxx, setPxx] = createSignal("");
  const [status, setStatus] = createSignal("");

  createEffect(() => {
    setPxx(pxx().toLocaleLowerCase())
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!users.includes(pxx())) {
        setStatus("Mineur inconnu, merci de bien renseigner l'identifiant du portail.");
        return;
      }
      var res = await (await fetch("/api/paps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": token(),
        },
        body: JSON.stringify({
          eid: params.id,
          pxx: pxx(),
        }),
      })).json();
      if (res.success === false) {
        setStatus(res.message || "Erreur lors de l'enregistrement. Merci de réessayer.");
        return;
      } else {
        setStatus("Ta demande a bien été enregistrée ! Tu seras notifié dans les heures qui suivent :)");
        refetch();
      }
    } catch (err) {
      setStatus("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <Layout floating={true}>
      <MetaProvider>
        <Title>{ev()?.name ? `Événement - ${ev().name}` : "Événement"}</Title>
      </MetaProvider>
      <div class="flex flex-col w-full">
        <BackButton/>
        {ev.loading && <div>Chargement...</div>}
        {ev.error && <div>Erreur : {ev.error.message}</div>}
        {ev() && (
          <>
            <div class="mb-2">
              <h2 class="text-2xl font-bold">{ev().name}</h2>
              <LinkButton href={"/editevent/" + ev().id}>Modifier l'événement (admin only)</LinkButton>
            </div>
            <div class="mb-2 text-gray-700 flex flex-row items-center gap-1">
              <Icon type="calendar-week" size={1}/>
              {new Date(ev().date).toLocaleString()}
            </div>
            <div class="mb-2 text-gray-700 flex flex-row items-center gap-1">
              <Icon type="location-dot" size={1}/>
              {ev().location}
            </div>
            <div class="mb-2 text-gray-700">
              <span class="font-semibold">Participants (hors accompagnants) :</span> {ev().participants}
            </div>
            <Show when={ev().description}>
              <div class="mb-2 text-gray-700">
                <div>{ev().description}</div>
              </div>
            </Show>
            
            <Show 
              when={new Date(ev().paps) < new Date()}
              fallback={<div class=" p-4 bg-yellow-100 border border-yellow-300 rounded">Ouverture de l'équi-PAPS le <b>{new Date(ev().paps).toLocaleString()}</b>
              </div>}>

              <div class="flex flex-col gap-1">
                <span class="font-semibold">Mineurs déjà inscrits :</span>
                <div>
                  <Show when={ev().users.length === 0}>
                    <span class="text-sm text-gray-600">Aucun mineur inscrit pour le moment.</span>
                  </Show>
                  <For each={ev().users}>
                    {(user, i) => (
                      <Show when={i() < ev().participants} fallback={<span class="inline-block text-sm px-2 py-1 rounded-full mr-1 mb-1 bg-rc/50 text-rf font-bold cursor-pointer"> {user} </span>}>
                        <span class="inline-block text-sm px-2 py-1 rounded-full mr-1 mb-1 bg-vc/30 text-vf font-bold cursor-pointer"> {user} ✓ </span>
                      </Show>
                    )}
                  </For>
                </div>
                N'hésite pas à t'inscrire même s'il ne reste plus de place, il y a souvent des désistements.<br/>
                <span><b>Critères de priorité :</b> cotisants, puis nombre de sorties effectuées, puis ordre d'inscription.</span>
              </div>
              <h3 class="text-xl font-bold mt-4 mb-2">équi-PAPS</h3>
              <form onSubmit={handleSubmit} class="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="XXnomdefamille (comme sur le portail)"
                  value={pxx()}
                  onInput={e => setPxx(e.target.value)}
                  required
                  class="border rounded p-2 w-full"
                  list="autocomplete-list"
                />
                <datalist id="autocomplete-list">
                  {users.map(word => (
                    <option value={word} />
                  ))}
                </datalist>
                <button type="submit" class="bg-vf text-white rounded p-2 font-bold">PAPS</button>
              </form>
            </Show>
            {status() && <div class="mt-2 text-center">{status()}</div>}
          </>
        )}
      </div>
    </Layout>
  );
}
import {
  Form,
  Links,
  Meta,
  Outlet,
  Link,
  NavLink,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import appStylesHref from "./app.css?url";
import { json, redirect,LoaderFunctionArgs } from "@remix-run/node";
import { Key } from "react";
import { createEmptyContact, getContacts } from "./data";
import { useEffect } from "react";
import { createData,getAllData } from "./firestore";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];

export const action = async () => {
  const contact = await createEmptyContact();
  const create = await createData(contact);
  return redirect(`/contacts/${contact.id}/edit`);
};

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const contacts = await getAllData();
  return json({ contacts, q });
};

export default function App() {

  const { contacts, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
  navigation.location &&
  new URLSearchParams(navigation.location.search).has(
    "q"
  );

  useEffect(() => {  
    const searchField = document.getElementById("q");
    if (searchField instanceof HTMLInputElement) {
      searchField.value = q || "";
    }
  }, [q]);


  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

        <div id="sidebar">

          <h1>Remix Contacts</h1>
          
          <div>
            <Form id="search-form" role="search" onChange={(event) => {
              const isFirstSearch = q === null;
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}>
              <input
                className={searching ? "loading" : ""}
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>

          <nav>
          {contacts.length ? (
              <ul>
                {contacts.map((contact) => (
                  <li key={contact.id}>
                     <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                          ? "pending"
                          : ""
                      }
                      to={`contacts/${contact.id}`}
                    >
                      <Link to={`contacts/${contact.id}`}>
                        {contact.first || contact.last ? (
                          <>
                            {contact.first} {contact.last}
                          </>
                        ) : (
                          <i>No Name</i>
                        )}{" "}
                        {contact.favorite ? (
                          <span>★</span>
                        ) : null}
                      </Link>
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No contacts</i>
              </p>
            )}
          </nav>

        </div>

        <div className={navigation.state === "loading" && !searching ? "loading": ""} id="detail">
            <Outlet />
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

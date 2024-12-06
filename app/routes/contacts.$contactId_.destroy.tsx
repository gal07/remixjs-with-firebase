import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deleteContact } from "../data";
import { deleteData } from "../firestore";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
//   await deleteContact(params.contactId);
  await deleteData(params.contactId);
  return redirect("/");
};

// TODO: Add messages page
import React from "react";
import { AuthUser } from "wasp/auth"
import { useRedirectHomeUnlessUserIsAdmin } from "../../../admin/useRedirectHomeUnlessUserIsAdmin"

function AdminMessages({user} : {user: AuthUser}) {
  useRedirectHomeUnlessUserIsAdmin({user})

  return (
    <div>Hello world!</div>
  )
}

export default AdminMessages

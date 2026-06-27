"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Org {
  id: string;
  name: string;
  slug: string;
}

interface Member {
  id: string;
  role: string;
  profiles: { full_name: string | null };
}

export function TeamManager() {
  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [orgName, setOrgName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/org")
      .then((r) => r.json())
      .then((data) => {
        setOrg(data.org);
        setMembers(data.members ?? []);
      });
  }, []);

  async function handleCreateOrg(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/org", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: orgName }),
    });
    const data = await res.json();
    if (res.ok) {
      setOrg(data.org);
      setMessage("Organization created!");
    } else {
      setMessage(data.error ?? "Failed to create organization");
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/org/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: inviteEmail }),
    });
    const data = await res.json();
    setMessage(res.ok ? "Invite sent!" : (data.error ?? "Failed to send invite"));
    setInviteEmail("");
  }

  if (!org) {
    return (
      <Card className="max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold text-purple-950">Create Your Team</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateOrg} className="space-y-4">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input id="orgName" value={orgName} onChange={(e) => setOrgName(e.target.value)} required />
            </div>
            <Button type="submit">Create Organization</Button>
            {message && <p className="text-sm text-slate-600">{message}</p>}
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
          <h1 className="text-2xl font-bold text-purple-950">{org.name}</h1>
          <p className="text-sm text-purple-600">Manage team members and shared signatures.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invite Team Member</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleInvite} className="flex gap-2">
            <Input
              type="email"
              placeholder="colleague@company.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required
            />
            <Button type="submit">Send Invite</Button>
          </form>
          {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Members ({members.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {members.length === 0 ? (
            <p className="text-sm text-slate-500">No members yet.</p>
          ) : (
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-2">
                  <span>{m.profiles?.full_name ?? "Team member"}</span>
                  <span className="text-xs capitalize text-slate-500">{m.role}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

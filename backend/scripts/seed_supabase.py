#!/usr/bin/env python3
"""Seed Supabase tables with representative Aquapump data.

This script is safe to run multiple times – it upserts newsletter signups and
chat sessions so duplicates are avoided. Use it to validate that a freshly.
provisioned environment (local or AWS) has working credentials and can persist
data end-to-end.
"""

from __future__ import annotations

import argparse
from datetime import datetime, timedelta, timezone
import random
import sys
from pathlib import Path
import uuid

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.supabase_client import (
    get_client,
    store_messages,
    upsert_chat_session,
    store_newsletter_signup,
)


def iso_now(offset_minutes: int = 0) -> str:
    return (datetime.now(timezone.utc) + timedelta(minutes=offset_minutes)).isoformat()


def seed_chat_sessions(client, count: int) -> None:
    scenarios = [
        (
            "How can AquaPump improve efficiency in large orchards?",
            "We recommend pairing AquaPump with soil moisture sensors to only irrigate rows that need it...",
        ),
        (
            "Does AquaPump integrate with existing irrigation timers?",
            "Yes. AquaPump exposes Modbus and MQTT endpoints so you can plug it into common PLC setups.",
        ),
        (
            "What maintenance schedule do you suggest?",
            "Monthly backflush plus a quarterly inspection keeps the pumps within spec.",
        ),
    ]
    for idx in range(count):
        session_id = uuid.uuid5(uuid.NAMESPACE_DNS, f"seed-session-{idx + 1}").hex
        question, answer = random.choice(scenarios)
        created_user = iso_now(-(idx * 5 + 2))
        created_bot = iso_now(-(idx * 5))
        messages = [
            {
                "session_id": session_id,
                "role": "user",
                "content": question,
                "created_at": created_user,
            },
            {
                "session_id": session_id,
                "role": "assistant",
                "content": answer,
                "created_at": created_bot,
            },
        ]
        store_messages(client, messages)
        upsert_chat_session(
            client,
            {
                "session_id": session_id,
                "message_count": len(messages),
                "last_user_message": question,
                "last_assistant_message": answer[:512],
                "updated_at": created_bot,
                "metadata": {"seed": True},
            },
        )


def seed_newsletter(client, count: int) -> None:
    domains = ["example.com", "contoso.io", "farmco.org"]
    for idx in range(count):
        email = f"seed-user-{idx+1}@{random.choice(domains)}"
        store_newsletter_signup(
            client,
            email=email,
            source="seed-script",
            metadata={"utm_campaign": "dev-seed"},
        )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--sessions",
        type=int,
        default=3,
        help="Number of chat sessions to create (default: 3)",
    )
    parser.add_argument(
        "--newsletter",
        type=int,
        default=5,
        help="Number of newsletter signups to upsert (default: 5)",
    )
    args = parser.parse_args()

    client = get_client()
    seed_chat_sessions(client, max(args.sessions, 0))
    seed_newsletter(client, max(args.newsletter, 0))
    print(
        f"Seeded {max(args.sessions,0)} chat session(s) "
        f"and {max(args.newsletter,0)} newsletter signup(s)."
    )


if __name__ == "__main__":
    main()

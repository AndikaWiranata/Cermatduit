<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Rules
- Chat UI (src/components/chat) calls only src/hooks/use-chat; network logic lives in src/lib/chat-service with endpoint in src/lib/chat-config (VITE_N8N_WEBHOOK_URL) — keeps n8n integration swappable.

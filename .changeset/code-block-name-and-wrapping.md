---
"@dicehub/kappa": minor
---

Add CodeBlock as the preferred code display API at `@dicehub/kappa/components/code-block`. Existing CodeHighlighted imports remain supported. Add line wrapping, title and header actions slots, and keyboard access to scrollable code. Keep line numbers aligned when lines wrap. Add optional collapsed previews with accessible expand and collapse controls; copying always includes the full source. Display plain code and logs without ShikiProvider or highlighting dependencies; the default language is text.

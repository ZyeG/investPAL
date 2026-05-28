FROM node:20-bookworm-slim

WORKDIR /app

# Optional: install Claude CLI for real analysis mode.
# If you do not need it, remove this line to slim the image.
RUN npm install -g @anthropic-ai/claude-code

COPY agents ./agents
COPY frontend ./frontend
COPY investpal ./investpal
COPY skills ./skills
COPY output ./output
COPY install.sh README.md LICENSE ./

RUN chmod +x ./install.sh && ./install.sh

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3737

EXPOSE 3737

CMD ["node", "frontend/server.js"]

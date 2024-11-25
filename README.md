# FileOverlay

## Compose Repositories Like Code

FileOverlay lets you seamlessly combine and transform Git repositories and file objects. Build modular architectures, manage templates, and compose codebases with the precision of a package manager.

```bash
curl https://fileoverlay.com/overlay/owner/base-repo/owner2/features
```

## Why FileOverlay?

### Modular Architecture at Scale

Break down monolithic codebases into composable units. Layer features, configurations, and customizations without maintaining forks or dealing with complex merge conflicts.

### Template System That Grows With You

- Start with a base template
- Layer in team-specific configurations
- Add project-specific customizations
- All while maintaining the ability to pull updates from upstream

### Built for Modern Development Workflows

Transform how you manage multi-repository architectures:

- **Zero Lock-in**: Works with any Git repository or file object
- **API-First Design**: Full programmatic control through a clean REST API
- **Streaming Updates**: Real-time progress for large-scale operations
- **Flexible Output**: Get results as patches, JSON, or streaming events
- **Authentication Ready**: Secure access with API keys for private repositories

## Perfect For:

- Creating standardized project templates that stay up-to-date
- Managing feature toggles and configurations across multiple environments
- Building white-label solutions with client-specific customizations
- Maintaining microservices with shared foundations
- Implementing multi-tenant architectures with customizable overlays

## Technical Highlights

```typescript
// Layer multiple repositories with a single API call
POST /overlay
{
  "sources": [
    { "fileObjectUrl": "https://uithub.com/base/template" },
    { "fileObjectUrl": "https://uithub.com/team/config" },
    { "fileObjectUrl": "https://uithub.com/project/customization" }
  ]
}
```

- **Smart Conflict Resolution**: Deterministic overlay strategy
- **Efficient Processing**: Streams changes for large repositories
- **Format Flexibility**: Get results as patches, JSON, or streaming updates
- **CORS Enabled**: Ready for browser-based applications
- **Enterprise Ready**: Support for private repositories and API keys

## Getting Started

1. Identify your base repository
2. Define your overlay sources
3. Make a single API call
4. Apply the changes or use the combined result

## Use Cases

### Standardized Team Templates

Maintain a single source of truth for project setups while allowing team-specific customizations to coexist seamlessly.

### Feature Management

Layer feature sets on demand, perfect for managing multiple client configurations or feature flags in a clean, maintainable way.

### White-Label Solutions

Build a core product and layer client-specific customizations without maintaining separate forks or dealing with merge conflicts.

## Ready to Transform Your Repository Management?

[Get Started with FileOverlay →](https://fileoverlay.com/docs)

---

Built by developers, for developers. FileOverlay is open source and production-ready.

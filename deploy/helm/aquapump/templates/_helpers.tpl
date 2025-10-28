{{- define "aquapump.imageRegistry" -}}
{{- $registry := .component.image.registry | default .defaults.registry -}}
{{- trimSuffix "/" $registry -}}
{{- end -}}

{{- define "aquapump.image" -}}
{{- $repository := required "Component image.repository is required" .component.image.repository -}}
{{- $registry := include "aquapump.imageRegistry" . -}}
{{- if $registry }}
{{- printf "%s/%s" $registry $repository -}}
{{- else -}}
{{- $repository -}}
{{- end -}}
{{- end -}}

{{- define "aquapump.imageTag" -}}
{{- $tag := .component.image.tag | default .defaults.tag | default "latest" -}}
{{- $tag -}}
{{- end -}}

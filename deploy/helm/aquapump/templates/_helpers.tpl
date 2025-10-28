{{- define "aquapump.componentFullname" -}}
{{- printf "%s-%s" .Release.Name .componentName -}}
{{- end -}}

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

{{- define "aquapump.serviceAccountName" -}}
{{- $component := .component -}}
{{- $global := .global | default (dict) -}}
{{- $componentName := .componentName -}}
{{- $release := .Release -}}
{{- $componentSA := $component.serviceAccount | default (dict) -}}
{{- $globalSA := $global.serviceAccount | default (dict) -}}
{{- if $componentSA.name }}
{{- $componentSA.name -}}
{{- else if $globalSA.name }}
{{- $globalSA.name -}}
{{- else -}}
{{- printf "%s-%s" $release.Name $componentName -}}
{{- end -}}
{{- end -}}

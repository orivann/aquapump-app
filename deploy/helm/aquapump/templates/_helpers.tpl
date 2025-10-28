{{/* Expand the name of the chart. */}}
{{- define "aquapump.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* Create a default fully qualified app name. */}}
{{- define "aquapump.fullname" -}}
{{- $name := default .Chart.Name .Values.fullnameOverride -}}
{{- if contains $name .Release.Name -}}
{{- printf "%s" .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}

{{- define "aquapump.backendName" -}}
{{- printf "%s-backend" (include "aquapump.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "aquapump.frontendName" -}}
{{- printf "%s-frontend" (include "aquapump.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "aquapump.backendFullname" -}}
{{- printf "%s-backend" (include "aquapump.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "aquapump.frontendFullname" -}}
{{- printf "%s-frontend" (include "aquapump.fullname" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "aquapump.resolveImage" -}}
{{- $root := index . 0 -}}
{{- $image := index . 1 -}}
{{- $registry := trimSuffix "/" (default "" $root.Values.image.registry) -}}
{{- $globalTag := default $root.Chart.AppVersion $root.Values.image.tag -}}
{{- $tag := default $globalTag (default "" $image.tag) -}}
{{- if eq $tag "" -}}
{{- $tag = $root.Chart.AppVersion -}}
{{- end -}}
{{- if ne $registry "" -}}
{{- printf "%s/%s:%s" $registry $image.repository $tag -}}
{{- else -}}
{{- printf "%s:%s" $image.repository $tag -}}
{{- end -}}
{{- end -}}

{{- define "aquapump.backendImage" -}}
{{- include "aquapump.resolveImage" (list . .Values.image.backend) -}}
{{- end -}}

{{- define "aquapump.frontendImage" -}}
{{- include "aquapump.resolveImage" (list . .Values.image.frontend) -}}
{{- end -}}

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

{{- define "aquapump.backendServiceUrl" -}}
  {{- printf "http://%s.%s.svc.cluster.local:%d" (include "aquapump.backendFullname" .) .Release.Namespace (int .Values.backend.service.port) -}}
{{- end -}}

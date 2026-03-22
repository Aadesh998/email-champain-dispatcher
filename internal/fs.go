package webserver

import "embed"

//go:embed dist/*
var DistFolder embed.FS

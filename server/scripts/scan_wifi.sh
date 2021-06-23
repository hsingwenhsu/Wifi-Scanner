#/bin/sh
nmcli dev wifi rescan
var=$(nmcli dev wifi list)


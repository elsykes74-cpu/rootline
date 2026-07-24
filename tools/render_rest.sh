#!/bin/bash
set -e
cd "/c/Users/E Sykes/Documents/kimi/workspace/rootline/tools"
source <(sed -n '1,23p' render_segments.sh | grep -v '^"$FF"')
step thumb-blacktech.png  seg5.mp4 150 s4m.txt s4s.txt
step thumb-hiphop.png     seg6.mp4 165 s5m.txt s5s.txt
"$FF" -y -i "$IMG/hero.png" -vf "$(kb "$IMG/hero.png" 180),drawbox=x=0:y=0:w=iw:h=ih:color=black@0.72:t=fill,vignette=PI/4.5,drawtext=$FB:textfile=end.txt:fontsize=110:fontcolor=$GOLD:x=(w-text_w)/2:y=h*0.40:shadowcolor=black@0.85:shadowx=4:shadowy=4,drawbox=x=(iw-806)/2:y=ih*0.62:w=260:h=16:color=0xD4A437:t=fill,drawbox=x=(iw-806)/2+273:y=ih*0.62:w=260:h=16:color=0xB5372A:t=fill,drawbox=x=(iw-806)/2+546:y=ih*0.62:w=260:h=16:color=0x1E6B4F:t=fill,format=yuv420p" -frames:v 180 -c:v libx264 -preset veryfast -crf 18 seg/seg7.mp4 2>&1 | grep -E "error|Error" || true
echo "done seg7"
ls -la seg/

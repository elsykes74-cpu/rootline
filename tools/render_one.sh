#!/bin/bash
# Render a single step-card segment (same filters as render_v2.sh).
# $1 img, $2 out, $3 frames, $4 main textfile, $5 sub textfile
set -e
cd "/c/Users/E Sykes/Documents/kimi/workspace/rootline/tools"
FF=./node_modules/ffmpeg-static/ffmpeg.exe
IMG="/c/Users/E Sykes/Documents/kimi/workspace/rootline/public/images"
FB="fontfile='C\:/Windows/Fonts/georgiab.ttf'"
FR="fontfile='C\:/Windows/Fonts/georgia.ttf'"
GOLD="0xD4A437"
CREAM="0xF5EFE6"

kb() {
  echo "scale=2560:1440:force_original_aspect_ratio=increase:flags=lanczos,crop=2560:1440,zoompan=z='min(1+0.0007*on\,1.25)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=$2:s=1920x1080:fps=30"
}

GRAD="drawbox=x=0:y=ih*0.60:w=iw:h=ih*0.10:color=black@0.15:t=fill,drawbox=x=0:y=ih*0.70:w=iw:h=ih*0.10:color=black@0.28:t=fill,drawbox=x=0:y=ih*0.80:w=iw:h=ih*0.20:color=black@0.45:t=fill"

"$FF" -y -i "$IMG/$1" -vf "$(kb "$IMG/$1" $3),vignette=PI/4.5,$GRAD,drawtext=$FB:textfile=$4:fontsize=68:fontcolor=$CREAM:x=(w-text_w)/2:y=h-260:shadowcolor=black@0.8:shadowx=3:shadowy=3,drawtext=$FR:textfile=$5:fontsize=40:fontcolor=$GOLD:x=(w-text_w)/2:y=h-160:shadowcolor=black@0.8:shadowx=2:shadowy=2,format=yuv420p" -frames:v $3 -c:v libx264 -preset veryfast -crf 18 "seg/$2" 2>&1 | grep -E "error|Error" || true
echo "done $2"

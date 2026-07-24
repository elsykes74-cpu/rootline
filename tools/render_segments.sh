#!/bin/bash
# Render ROOTLINE intro segments: Ken Burns zoompan + drawtext overlays.
set -e
cd "/c/Users/E Sykes/Documents/kimi/workspace/rootline/tools"
FF=./node_modules/ffmpeg-static/ffmpeg.exe
IMG="/c/Users/E Sykes/Documents/kimi/workspace/rootline/public/images"
FB="fontfile='C\:/Windows/Fonts/georgiab.ttf'"
FR="fontfile='C\:/Windows/Fonts/georgia.ttf'"
GOLD="0xD4A437"
CREAM="0xF5EFE6"

kb() { # $1 image, $2 frames  -> Ken Burns zoompan string
  echo "scale=2560:1440:force_original_aspect_ratio=increase:flags=lanczos,crop=2560:1440,zoompan=z='min(1+0.0007*on\,1.25)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=$2:s=1920x1080:fps=30"
}

# soft dark bottom gradient (3 stacked alpha boxes) for legibility
GRAD="drawbox=x=0:y=ih*0.60:w=iw:h=ih*0.10:color=black@0.15:t=fill,drawbox=x=0:y=ih*0.70:w=iw:h=ih*0.10:color=black@0.28:t=fill,drawbox=x=0:y=ih*0.80:w=iw:h=ih*0.20:color=black@0.45:t=fill"

step() { # $1 img, $2 out, $3 frames, $4 main textfile, $5 sub textfile
  "$FF" -y -i "$IMG/$1" -vf "$(kb "$IMG/$1" $3),vignette=PI/4.5,$GRAD,drawtext=$FB:textfile=$4:fontsize=68:fontcolor=$CREAM:x=(w-text_w)/2:y=h-260:shadowcolor=black@0.8:shadowx=3:shadowy=3,drawtext=$FR:textfile=$5:fontsize=40:fontcolor=$GOLD:x=(w-text_w)/2:y=h-160:shadowcolor=black@0.8:shadowx=2:shadowy=2,format=yuv420p" -frames:v $3 -c:v libx264 -preset veryfast -crf 18 "seg/$2" 2>&1 | grep -E "error|Error" || true
  echo "done $2"
}

# S1 opening title on hero
"$FF" -y -i "$IMG/hero.png" -vf "$(kb "$IMG/hero.png" 165),vignette=PI/4.5,drawbox=x=0:y=0:w=iw:h=ih:color=black@0.35:t=fill,drawtext=$FB:textfile=title.txt:fontsize=170:fontcolor=$GOLD:x=(w-text_w)/2:y=h*0.38:shadowcolor=black@0.85:shadowx=4:shadowy=4,drawtext=$FR:textfile=title_sub.txt:fontsize=52:fontcolor=$CREAM:x=(w-text_w)/2:y=h*0.38+230:shadowcolor=black@0.8:shadowx=3:shadowy=3,format=yuv420p" -frames:v 165 -c:v libx264 -preset veryfast -crf 18 seg/seg1.mp4 2>&1 | grep -E "error|Error" || true
echo "done seg1"

step thumb-culture.png    seg2.mp4 150 s1m.txt s1s.txt
step thumb-film.png       seg3.mp4 150 s2m.txt s2s.txt
step thumb-roots.png      seg4.mp4 150 s3m.txt s3s.txt
step thumb-blacktech.png  seg5.mp4 150 s4m.txt s4s.txt
step thumb-hiphop.png     seg6.mp4 165 s5m.txt s5s.txt

# S7 end card on hero, heavy dark + kente stripes (gold/red/green)
"$FF" -y -i "$IMG/hero.png" -vf "$(kb "$IMG/hero.png" 180),drawbox=x=0:y=0:w=iw:h=ih:color=black@0.72:t=fill,vignette=PI/4.5,drawtext=$FB:textfile=end.txt:fontsize=110:fontcolor=$GOLD:x=(w-text_w)/2:y=h*0.40:shadowcolor=black@0.85:shadowx=4:shadowy=4,drawbox=x=(iw-806)/2:y=ih*0.62:w=260:h=16:color=0xD4A437:t=fill,drawbox=x=(iw-806)/2+273:y=ih*0.62:w=260:h=16:color=0xB5372A:t=fill,drawbox=x=(iw-806)/2+546:y=ih*0.62:w=260:h=16:color=0x1E6B4F:t=fill,format=yuv420p" -frames:v 180 -c:v libx264 -preset veryfast -crf 18 seg/seg7.mp4 2>&1 | grep -E "error|Error" || true
echo "done seg7"

ls -la seg/

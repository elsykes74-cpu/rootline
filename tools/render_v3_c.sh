#!/bin/bash
# ROOTLINE intro v3 — part C: seg6 + seg7 + concat + mux (seg1-5 already rendered).
set -e
cd "/c/Users/E Sykes/Documents/kimi/workspace/rootline/tools"
FF=./node_modules/ffmpeg-static/ffmpeg.exe
IMG="/c/Users/E Sykes/Documents/kimi/workspace/rootline/public/images"
FB="fontfile='C\:/Windows/Fonts/georgiab.ttf'"
GOLD="0xD4A437"

F6=$(python -c "import json;print(json.load(open('seg_frames.json'))['6'])")
F7=$(python -c "import json;print(json.load(open('seg_frames.json'))['7'])")

kb() {
  echo "scale=2560:1440:force_original_aspect_ratio=increase:flags=lanczos,crop=2560:1440,zoompan=z='min(1+0.0007*on\,1.25)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=$2:s=1920x1080:fps=30"
}
GRAD="drawbox=x=0:y=ih*0.60:w=iw:h=ih*0.10:color=black@0.15:t=fill,drawbox=x=0:y=ih*0.70:w=iw:h=ih*0.10:color=black@0.28:t=fill,drawbox=x=0:y=ih*0.80:w=iw:h=ih*0.20:color=black@0.45:t=fill"

FR="fontfile='C\:/Windows/Fonts/georgia.ttf'"
CREAM="0xF5EFE6"
step() {
  "$FF" -y -i "$IMG/$1" -vf "$(kb "$IMG/$1" $3),vignette=PI/4.5,$GRAD,drawtext=$FB:textfile=$4:fontsize=68:fontcolor=$CREAM:x=(w-text_w)/2:y=h-260:shadowcolor=black@0.8:shadowx=3:shadowy=3,drawtext=$FR:textfile=$5:fontsize=40:fontcolor=$GOLD:x=(w-text_w)/2:y=h-160:shadowcolor=black@0.8:shadowx=2:shadowy=2,format=yuv420p" -frames:v $3 -c:v libx264 -preset veryfast -crf 18 "seg/$2" 2>&1 | grep -E "error|Error" || true
  echo "done $2"
}

step thumb-hiphop.png     seg6.mp4 $F6 s5m.txt s5s.txt

# S7 end card on hero, heavy dark + kente stripes (gold/red/green)
"$FF" -y -i "$IMG/hero.png" -vf "$(kb "$IMG/hero.png" $F7),drawbox=x=0:y=0:w=iw:h=ih:color=black@0.72:t=fill,vignette=PI/4.5,drawtext=$FB:textfile=end.txt:fontsize=110:fontcolor=$GOLD:x=(w-text_w)/2:y=h*0.40:shadowcolor=black@0.85:shadowx=4:shadowy=4,drawbox=x=(iw-806)/2:y=ih*0.62:w=260:h=16:color=0xD4A437:t=fill,drawbox=x=(iw-806)/2+273:y=ih*0.62:w=260:h=16:color=0xB5372A:t=fill,drawbox=x=(iw-806)/2+546:y=ih*0.62:w=260:h=16:color=0x1E6B4F:t=fill,format=yuv420p" -frames:v $F7 -c:v libx264 -preset veryfast -crf 18 seg/seg7.mp4 2>&1 | grep -E "error|Error" || true
echo "done seg7"

printf "file 'seg/seg1.mp4'\nfile 'seg/seg2.mp4'\nfile 'seg/seg3.mp4'\nfile 'seg/seg4.mp4'\nfile 'seg/seg5.mp4'\nfile 'seg/seg6.mp4'\nfile 'seg/seg7.mp4'\n" > concat.txt
"$FF" -y -f concat -safe 0 -i concat.txt -c copy video_only.mp4 2>&1 | grep -E "error|Error" || true
echo "concat done"

"$FF" -y -i video_only.mp4 -i voiceover_final.mp3 -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart "/c/Users/E Sykes/Documents/kimi/workspace/rootline/public/videos/intro.mp4" 2>&1 | grep -E "error|Error" || true
echo "mux done"

"$FF" -i "/c/Users/E Sykes/Documents/kimi/workspace/rootline/public/videos/intro.mp4" 2>&1 | grep -E "Duration|Stream"

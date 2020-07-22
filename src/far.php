<?php
for ($i=0; $i < 4; $i++) { 
    if($i<10)
        exec("find . -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/\"id_100$i\"/\"id_10_0$i\"/g'");
    else 
        exec("find . -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/\"id_10$i\"/\"id_10_$i\"/g'");
}
for ($k=0; $k < 4; $k++) { 
    if($k<10)
        exec("find . -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/id_100$k:/id_10_0$k:/g'");
    else 
        exec("find . -type f -name '*.js' -print0 | xargs -0 sed -i '' -e 's/id_10$k:/id_10_$k:/g'");
}
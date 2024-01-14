from glob import glob
import json
import os
import shutil

BASE_POOL_PATH = "/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF"

json_file_path = "/Users/jbe/static-sites/never-forget-vite-vue2/src/data/selections/aex/dump_5star_390.json"
json_file_name = json_file_path.split("/")[-1].replace(".json", "")
COPY_TO = f"/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/{json_file_name}"
os.mkdir(COPY_TO)

with open(json_file_path, "r") as f:
    img_paths = json.load(f)

for img_path in img_paths:
    print(img_path)
    search_glob = img_path.replace("/2pass/", "/fried/").split("_cnet_c-0")[0]
    result = list(
        glob(
            f"{BASE_POOL_PATH}/{search_glob}*",
            recursive=True,
        )
    )
    if len(result) > 0:
        fried_path_on_disk = result[0]
        file_destination = f"{COPY_TO}/{os.path.basename(fried_path_on_disk)}"
        shutil.copy(fried_path_on_disk, file_destination)
    else:
        print("found nothing.")
        continue

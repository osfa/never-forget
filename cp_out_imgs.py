from glob import glob
import json
import os
import shutil

BASE_POOL_PATH = "/Users/jbe/Dropbox/stabdiff-ui-v2/comfyui-outs/_NF"
BASE_POOL_PATH = "/Volumes/DSK8/never-forget"


json_file_path = "/Users/jbe/static-sites/never-forget-vite-vue2/src/data/selections/aex/dump_5star_390.json"
json_file_path = "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/fives-feb-13.json"

json_file_path = "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/grov-sortering-all-v1-26feb-4+.json"

json_file_name = json_file_path.split("/")[-1].replace(".json", "")
COPY_TO = f"/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_selections/{json_file_name}"
COPY_TO = f"/Users/jbe/Desktop/never-forget-pooling/{json_file_name}"

with open(json_file_path, "r") as f:
    img_paths = json.load(f)

# COPY_TO = f"/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_processing-singles/_for-upscale/_sel1/_jpeg/png"

# os.mkdir(COPY_TO)

# img_paths = glob(
#     "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_processing-singles/_for-upscale/_sel1/_jpeg/fried/*.jpg"
# )
# img_paths = glob(
#     "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_processing-singles/_for-upscale/_sel1/_jpeg/_hacks/*.jpg"
# )

for img_path in img_paths:

    # ending_to_remove = img_path.split(".jpg")[-1]
    # img_path = img_path.replace(ending_to_remove, "")
    # print(img_path)

    # print(img_path["id"])
    png_path = f"{BASE_POOL_PATH}/{img_path['id']}"
    file_destination = f"{COPY_TO}/{os.path.basename(png_path)}"
    try:
        shutil.copy(png_path.replace("MP-1.0", "MP-1"), file_destination)
    except FileNotFoundError:
        print(f"File not found: {png_path}")

    continue
    search_glob = (
        img_path.replace("/2pass/", "/fried/")
        # .split("_cnet_c-0")[0]
        # .replace(
        #     "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_processing-singles/_for-upscale/_sel1/_jpeg/_fn-fix/",
        #     "",
        # )
        # .replace(
        #     "/Users/jbe/Dropbox/stabdiff-ui-v2/_sorted-outputs/never-forget/_processing-singles/_for-upscale/_sel1/_jpeg/_hacks/",
        #     "",
        # )
    )
    # search_glob = img_path
    # print(search_glob)

    final_glob = f"{BASE_POOL_PATH}/NF-03-5/**/{search_glob}*.png"
    print(final_glob)

    result = list(
        glob(
            final_glob,
            recursive=True,
        )
    )
    if len(result) > 0:
        fried_path_on_disk = result[0]
        file_destination = f"{COPY_TO}/{os.path.basename(fried_path_on_disk)}"
        shutil.copy(fried_path_on_disk, file_destination)
    else:
        print(img_path)
        print("found nothing.")
        continue

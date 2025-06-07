import json
import os
from datetime import datetime
import logging

# ロガーの設定
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def update_artwork_dates():
    try:
        # JSONファイルを読み込む
        logging.info("Reading artworks.json...")
        with open('docs/data/artworks.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
        logging.info("Successfully read artworks.json.")
        
        # 各アートワークに対して処理
        for artwork in data['artworks']:
            try:
                # 画像ファイルのパスを取得
                image_filename = artwork['id'].split('_', 1)[1] + '.jpg'
                image_path = os.path.join('docs/images', image_filename)
                
                # ファイルの更新日時を取得
                if os.path.exists(image_path):
                    timestamp = os.path.getmtime(image_path)
                    date = datetime.fromtimestamp(timestamp)
                    
                    new_date_str = date.strftime('%Y-%m-%d')

                    # 日付が実際に変更される場合のみ更新・ログ出力
                    if artwork.get('date') != new_date_str:
                        # 日付情報を更新
                        artwork['date'] = new_date_str
                        artwork['year'] = date.year
                        artwork['month'] = date.month
                        logging.info(f"Updated date for {artwork['id']} to {new_date_str}")
                    else:
                        logging.info(f"Date for {artwork['id']} is already up to date ({artwork.get('date')}). Skipping update.")
                else:
                    logging.warning(f"Image file not found for {artwork['id']}: {image_path}")

            except (KeyError, IndexError, ValueError) as e:
                logging.error(f"Error processing artwork ID {artwork.get('id', 'N/A')}. Could not parse date from ID. Error: {e}")
            except Exception as e:
                logging.error(f"An unexpected error occurred while processing artwork {artwork.get('id', 'N/A')}: {e}")

        # totalCountを更新
        data['totalCount'] = len(data['artworks'])
        logging.info(f"Total count updated to: {data['totalCount']}")
        
        # lastUpdateを現在時刻で更新
        data['lastUpdate'] = datetime.now().strftime('%Y-%m-%d')
        logging.info(f"Last update timestamp set to: {data['lastUpdate']}")
        
        # 更新したJSONを保存
        logging.info("Writing updated data to artworks.json...")
        with open('docs/data/artworks.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        logging.info("Successfully wrote to artworks.json.")

    except FileNotFoundError:
        logging.error("artworks.json not found. Please check the file path.")
    except json.JSONDecodeError:
        logging.error("Failed to decode artworks.json. Please check if it's a valid JSON.")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")

if __name__ == '__main__':
    logging.info("Starting artwork date update script.")
    update_artwork_dates()
    logging.info("Artwork date update script finished.") 
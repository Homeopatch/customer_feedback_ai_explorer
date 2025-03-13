#!/usr/bin/env python3
"""
Script to download the Amazon review dataset from Kaggle.
Requires the Kaggle API credentials to be set up.
"""

import os
import subprocess
import zipfile
import shutil

def main():
    print("Downloading Amazon review dataset from Kaggle...")
    
    # Check if Kaggle credentials are set up
    kaggle_dir = os.path.expanduser("~/.kaggle")
    kaggle_json = os.path.join(kaggle_dir, "kaggle.json")
    
    if not os.path.exists(kaggle_json):
        print("Kaggle API credentials not found.")
        print("Please follow these steps to set up Kaggle API:")
        print("1. Create a Kaggle account at https://www.kaggle.com/")
        print("2. Go to your account settings and create an API token")
        print("3. Download the kaggle.json file")
        print("4. Create a directory ~/.kaggle if it doesn't exist")
        print("5. Move the kaggle.json file to ~/.kaggle/")
        print("6. Run 'chmod 600 ~/.kaggle/kaggle.json' to set permissions")
        print("7. Run this script again")
        return
    
    # Create data directory if it doesn't exist
    data_dir = "data"
    os.makedirs(data_dir, exist_ok=True)
    
    # Download the dataset
    try:
        subprocess.run(
            ["kaggle", "datasets", "download", "mehmetisik/amazon-review"],
            check=True
        )
        
        # Extract the dataset
        print("Extracting dataset...")
        with zipfile.ZipFile("amazon-review.zip", "r") as zip_ref:
            zip_ref.extractall(data_dir)
        
        # Clean up
        os.remove("amazon-review.zip")
        
        print(f"Dataset downloaded and extracted to {data_dir}/")
        print("You can now use this dataset to test the application.")
        
    except subprocess.CalledProcessError:
        print("Failed to download the dataset. Make sure your Kaggle API credentials are correct.")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
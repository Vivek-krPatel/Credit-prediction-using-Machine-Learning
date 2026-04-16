import sys
import numpy as np
import pickle

import warnings
warnings.filterwarnings("ignore")

# -----------------------------
# LOAD MODEL
# -----------------------------
with open("model.pkl", "rb") as f:
    model = pickle.load(f)


# -----------------------------
# MAIN
# -----------------------------
if __name__ == "__main__":
    try:
        # Read features from CLI args
        # sys.argv[0] = script name
        args = sys.argv[1:]

        if len(args) != 8:
            raise ValueError("Expected 8 features")

        # Convert to float
        features = [float(x) for x in args]

        # Reshape for sklearn
        X = np.array(features).reshape(1, -1)

        # Predict
        prediction = model.predict(X)[0]

        output = str(int(prediction))

        print(output)

    except Exception as e:
        # Important: print something so Java doesn't get null
        print("ERROR")
// remove/replace certain phrases in labels
export default function labelFormatter(label: string) {
    let outputLabel = label;

    if (outputLabel.includes("Touchdowns")) { 
        outputLabel = outputLabel.replace("Touchdowns", "TD");                  // replace "Touchdowns" with "TD"
    } 
    if (outputLabel.includes("Per")) { 
        outputLabel = outputLabel.replace("Per ", "/ ");                          // replace "Per" with "/"
    } 
    if (outputLabel.includes("Rush Attempt")) { 
        outputLabel = outputLabel.replace("Rush Attempt", "Rush");              // replace "Rush Attempt" with "Rush"
    } 
    if (outputLabel.includes("Rushing Attempts")) { 
        outputLabel = outputLabel.replace("Rushing Attempts", "Rush Attempts");  // replace "Rushing Attempts" with "Rush Attempts"
    }
    if (outputLabel.includes("Percentage")) { 
        outputLabel = outputLabel.replace("Percentage", "%");  // replace "Rushing Attempts" with "Rush Attempts"
    }
    return outputLabel;
}
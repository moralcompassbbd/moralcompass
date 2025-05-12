import { createDetail } from "./components.js";


export const initResults = () => {
    const container = document.getElementById('results-container')
    for(var i = 0; i < 10; i++) {
        const detailElem = createDetail({
            summaryText: `Question ${i}: Should terminally ill patients have the right to assisted suicide?`,
            content: "You chose Option 1: Yes, people should have control over their own death\n80% of users chose Option 1",
            open: false,
            // className: 'ethical-detail'
          });
        container?.appendChild(detailElem);
    }
}
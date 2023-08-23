if (figma.command === 'createDevResource') {
  // Get the first node in the document that matches the condition
  const node = figma.root.findOne(node => node.type === "FRAME" && node.name.startsWith('https://www.figma.com/file/'));

  // If no matching node is found, notify the user and exit
  if (!node) {
    figma.notify('No matching node found.');
    figma.closePlugin();
  } else {
    // Regular expression to get the file key
    const regex = /file\/(.*?)\//;

    // Get file key from node name
    const match = node.name.match(regex);
    const fileKey = match ? match[1] : '';

    // Get selected layers
    const selectedLayers = figma.currentPage.selection;

    // Filter out Frame nodes
    const frameNodes = selectedLayers.filter(node => node.type === "FRAME");

    // Create URL for Frame nodes and save it as a dev resource
    const tasks = frameNodes.map(async frameNode => {
      const url = `https://www.figma.com/file/${fileKey}/?type=design&node-id=${frameNode.id}&mode=dev`;
      console.log(`URL: ${url}`);

      // Get existing dev resources
      const links = await frameNode.getDevResourcesAsync();

      // Check if a dev resource with the name 'master frame' already exists
      const existingLink = links.find(link => link.name === 'master frame');

      if (existingLink) {
        // If it exists, edit the existing resource
        await frameNode.editDevResourceAsync(existingLink.url, { name: 'master frame', url: url });
      } else {
        // If it does not exist, add a new resource
        await frameNode.addDevResourceAsync(url, 'master frame');
      }
    });

    // Wait for all tasks to complete
    Promise.all(tasks).then(() => {
      figma.notify(`${frameNodes.length} dev resources have been added to frames.`);
      figma.closePlugin();
    });
  }
}
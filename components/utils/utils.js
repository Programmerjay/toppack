export const importPkg = async (repoUrl, trackedPackages) => {
  const response = await fetch(`${repoUrl}/contents/package.json`, {
    headers: { Authorization: process.env.AUTH },
  });

  if (response.status == 404) {
    throw new Error("This project does not contain a package.json file");
  } else if (!response.ok) {
    throw new Error(`Error parsing package.json`);
  } else {
    const data = await response.json();

    const decodedContent = Buffer.from(data.content, "base64").toString();
    const packageJson = JSON.parse(decodedContent);

    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});

    let pkgArr = [...dependencies, ...devDependencies];
    let newtrackedPackages = trackedPackages;
    console.log(trackedPackages);
    pkgArr.forEach((p) => {
      newtrackedPackages[p] == undefined ? (newtrackedPackages[p] = 1) : (newtrackedPackages[p] += 1);
    });

    return newtrackedPackages;
  }
};

export const searchRepo = async (keyword) => {
  const response = await fetch(`https://api.github.com/search/repositories?q=${keyword}`, {
    headers: { Authorization: process.env.AUTH },
  });

  if (!response.ok) {
    throw new Error(`Error fetching repositories: Internal Server Error`);
  }
  const data = await response.json();

  return data.items;
};

export const checkRepo = (repos, newRepo) => {
  return repos.includes(newRepo);
};

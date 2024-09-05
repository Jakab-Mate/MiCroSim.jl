var documenterSearchIndex = {"docs":
[{"location":"readme/","page":"Home","title":"Home","text":"EditURL = \"https://github.com/Jakab-Mate/MiCroSim.jl/blob/main/README.md\"","category":"page"},{"location":"readme/#Microbial-Cross-feeding-Community-Simulator","page":"Home","title":"Microbial Cross-feeding Community Simulator","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"(Image: Build Status)","category":"page"},{"location":"readme/#A-general-purpose-microbial-consumer-resource-model-that-outputs-simulated-data-in-the-SummarizedExperiment-(SE)-format.","page":"Home","title":"A general-purpose microbial consumer-resource model that outputs simulated data in the SummarizedExperiment (SE) format.","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This project offers a quick and easy method for simulating microbial community dynamics based solely on their metabolic interactions. The model represents distinct microbial species as matrices that describe their net conversion rates in the form A -> nB, where A is the metabolite consumed, B is the metabolite excreted into a shared environment, and n is a stoichiometric constant. Additionally, the species housing the above net conversion (or reaction), will have generated some value (energy) during the process, which contributes to its own growth. Once excreted, metabolite B may be utilized by a different species, enabling cross-feeding (syntrophy) between the populations present in the community. The model incorporates a feeding term that describes the type and amount of resources that flow into the system per unit time. All observed growth in the community can be derived from this inflow of resources: some species will be able to directly consume the resources flowing into the habitat (as a renewable or depletable resource), while the preferred resources for other species will be the byproducts of the reaction(s) performed by different species.","category":"page"},{"location":"readme/#Applicability","page":"Home","title":"Applicability","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"Simulate the growth of an initially populated microbial community and find the equilibrium abundances\nSimulate the succession of an initially empty microbial habitat where colonizers appear one by one\nSimulate the resilience of a microbial community against invaders appearing one by one","category":"page"},{"location":"readme/#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"To install MiCroSim.jl directly from the github repository, use:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"using Pkg\nPkg.add(url=\"https://github.com/Jakab-Mate/MiCroSim.jl.git\")","category":"page"},{"location":"readme/#Workflow","page":"Home","title":"Workflow","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"The functions in this package rely on each other's outputs, so generally you will want to use them in the following order:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"create_metabolism(...)<span style=\"display:inline-block; width: 56px;\"></span>Generates the set of possible reactions (net conversions)\ncreatespeciespool(...)<span style=\"display:inline-block; width: 48px;\"></span>Generates the pool of possible species by sampling from the possible reactions\nsample_pool(...)<span style=\"display:inline-block; width: 100px;\"></span>Chooses the species that will appear in the simulation by sampling from the species pool\ngeneric_run(...)<span style=\"display:inline-block; width: 107px;\"></span>Takes the sampled species and simulates their dynamics based on a set of ODEs","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Detailed instructions for using each function can be found in their dedicated sections.","category":"page"},{"location":"readme/#create_metabolism()","page":"Home","title":"create_metabolism()","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This function generates the set of all possible reactions, or in other words a universal metabolism. Each reaction is characterized by 4 attributes: the metabolite that is being consumed, the metabolite that is being produced, the stoichiometric constant (unit resource produced per unit resource consumed), and the energy that the species gains per unit resource consumed. ","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"create_metabolism() outputs two matrices that hold the stoichiometric constants and the energy gains respectively. Each of these matrices is of size RxR, where R is the number of different resources, and each entry inside them corresponds to a specific reaction, where the column index indicates the resource being consumed, and the row index indicates the resource being produced. Importantly, the positions of zeros in these two matrices must align, and those reactions will not be possible.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"To ensure energy conservation, we use the following equation to calculate the energy yields for each reaction:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"(Image: formula)","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"where w_a and w_b denote the energy content of the resources and D_ba is the stoichiometric constant.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"To simulate a gut-microbiome scenario, where most reactions are catabolic, create_metabolism() operates under the following assumptions:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Resources can be grouped into different levels of decomposition, based on their energy content\nReactions will always yield some energy, meaning that the resource produced will always be of a lower level (more decomposed) than the resource consumed","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Mandatory parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"This function has no mandatory parameters.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Optional parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***n_resources:*** The number of different resources in the network, which determines the size of the output matrices. Default value is 10\n***nlevels:*** The number of levels of decomposition. Must be smaller or equal to *nresources, because each level will have at least one resource belonging to it. The lowest and the highest levels can only have one resource, and thus, the remaining resources will be of intermediate levels. *Default value is 5\n***energyyields:*** Either \"Uniform1\" or \"Random\". Denotes the energy difference between levels of decomposition, which can either be uniformly 1, or a random number whose expected value is 1. Default is \"Uniform_1\"\n***seed:*** See section Reproducibility","category":"page"},{"location":"readme/#create_species_pool()","page":"Home","title":"create_species_pool()","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This function generates a pool of species, a subset of which will be used for simulations later. The species pool consists of different families, whose members are functionally similar to each other. Family members will always possess the same set of reactions, with varied reaction rates. Each family has a \"prior\" or holotype, whose reaction rates are vectorized and used as the density parameter of a Dirichlet distribution. The reaction rates of family members are then sampled from this Dirichlet distribution. Families can either be specialist or generalist. Specialist families will have 2-3 reactions, while generalists will have 4-5. ","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Returning to our gut-microbiome scenario, we have introduced host regulation, the extent of which we assume to be identical in the members of the same family. We make the assumption that when the population of a microbial species reaches a certain size, the host will recognize this species as a potential threat, and start regulating its growth. Regulation is imposed according to the following equation:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"(Image: formula2)","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"where G_i is the growth rate of species i without host regulation, a controls the strength/speed of host regulation, k controls the critical population size and N_i is the population size of species i.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Mandatory parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***D:*** Matrix that denotes the possible reactions to sample from. The stoichiometric matrix and the energy_yield matrix are equally suitable for this role. Any non-zero position in the matrix will be deemed possible.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Optional parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***n_families:*** The number of families (functional groups) to create. Default is 5\n***familysize:*** The number of members inside a family. To exclude families from your simulations, set this parameter to 1, which will result in a number of functionally independent species equal to *nfamilies. *Default is 100\n***dirichlet_hyper:*** The higher the value of this parameter, the more similar species will be inside the same family. Default is 100\n***maintenance:*** The average cost of maintenance throughout the community. Default is 0.1 \n***betweenfamilyvar:*** The variance of maintenance between families. Default is 0.1\n***insidefamilyvar:*** The variance of maintenance between members of the same family. Default is 0.05 \n***specialist:*** Integer value that will be interpreted relative to generalist. Default is 1\n***generalist:*** Integer value. The expected ratio of generalist and specialist families in the species pool will be equal to the ratio of these parameters. Default is 1\n***a_dist:*** Parameter of type Distributions.Sampleable, which controls the speed of host regulation. Default is Uniform(0.5, 1.5)\n***k_dist:*** Parameter of type Distributions.Sampleable, which controls the population size where the host starts regulating growth. Default is Uniform(99.999, 100.001)\n***h:*** Parameter that controls the allocation of reaction rates. Before applying the effect of h, reaction rates in a single species will always sum to 1. These values are then divided by the sum of the reaction rates raised to the power of h. Values between 0-1 can be expected to favor specialists, while values above 1 can be expected to favor generalists.\n***seed:*** See section Reproducibility","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Output","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Output is a single object of type ***PoolStruct***. To access this type, use MiCroSim.PoolStruct(). This structure will have the following fields:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***pool:*** An array of size nresources x nresources x (nfamilies x familysize) which contains the matrices of all species inside the species pool","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"The rest of the fields are all attribute vectors of size (nfamilies x familysize)","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***family_ids:*** Denotes the family of each species.\n***m:*** Denotes the maintenance values of each species.\n***n_reactions:*** Denotes the number of reactions that each species houses\n***n_splits:*** Denotes cumulative complexity of each species' reaction repertoire\n***a:*** Denotes host regulation speed for each species\n***k:*** Denotes critical population size for each species","category":"page"},{"location":"readme/#sample_pool()","page":"Home","title":"sample_pool()","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This function randomly chooses some species matrices from a pool and takes the corresponding subset of the attribute vectors in the PoolStruct. It also assigns initial abundances (values between 0 and 1) for the species in the sample and all of the different resources.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Mandatory parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***p:*** A PoolStruct\n***n_species:*** Number of species initially present in the community\n***n_invaders:*** Number of species that will appear successively in the community","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Optional parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***seed:*** See section Reproducibility","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Output Output is a single object of type ***SampleStruct***. To access this type, use MiCroSim.SampleStruct(). This structure will have the following fields:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***n_species:*** Feed forward parameter value\n***n_invaders:*** Feed forward parameter value\n***C:*** Sample of species matrices \n***family_ids:*** Corresponding family ID-s\n***m:*** Corresponding maintenance costs\n***n_reactions:*** Corresponding number of reactions\n***n_splits:*** Corresponding complexity metric\n***a:*** Corresponding host regulation speed\n***k:*** Corresponding critical population size\n***species_abundance:*** Initial abundances for each of the sampled species\n***resource_abundance:*** Initial abundances for each resource","category":"page"},{"location":"readme/#generic_run()","page":"Home","title":"generic_run()","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This function takes a sample and solves a set of Ordinary Differential Equations (ODEs) to simulate the community dynamics. Along with the sample there are several tradeoff-s and other parameters controlling the simulation, whose values can be set here. In order to better understand what these parameters do, let's look at the ODEs:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Species dynamics is given by:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"(Image: formula3)","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"<a id=\"species\"></a> where delta_w is the energy yield matrix C are the species matrices, R are the resource abundances, m are the default maintenance values, E are the complexity metrics, eta describes how the complexity metrics contribute to maintenance costs, F are the number of reactions, phi describes how the number of reactions contribute to maintenance costs and N are the species abundances.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Resource dynamics is as follows:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"(Image: formula4)","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"<a id=\"resource\"></a> where K are the inflow rates, tau are the dilution rates, D is the stoichiometric matrix and the rest of the parameters are the same as above. The first term describes the inflow and depletion of resources from and into an outer environment, the second (negative) term describes consumption and the last (positive) term describes production.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Mandatory parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***sample:*** A SampleStruct","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Recommended but optional parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***path:*** Specifies the output folder for the results of the simulation. Default is homedir()\n***t_span:*** Tuple(Int64, Int64) that specifies the starting and ending time points for the simulation. Default is (0, 1000)\n***D:*** Stoichiometric matrix. Defaults to a random matrix generated by create_metabolism()\n***Wba:*** Energy yield matrix. *Defaults to a random matrix generated by `createmetabolism()`*","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"If either one of D or W_ba is missing, a warning is raised and both matrices will be given by create_metabolism() to ensure compatibility","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Optional parameters","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"***t_inv:*** Specifies the time between the appearance of two consecutive invading species. Default is 25.0\n***tinv0:*** Specifies the time of the first invasion Default is 100.0\n***cutoff:*** Specifies the abundance threshold below which a species can be considered extinct. Default is 0.0001\n***phi:*** See phi in species dynamics. Default is 0.1\n***eta:*** See eta in species dynamics. Default is 0.1\n***tau:*** See tau in resource dynamics. Defaults to a vector of length n_resources, where the value corresponding to the first (highest energy) resource is 100.0 and the rest are 0.0\n***alpha:*** See K in resource dynamics. Defaults to a vector of length n_resources, where all elements are 1.0\n***plot:*** Boolean parameter that controls whether to plot the results. Defaults to True\n***host_regulation:*** Boolean parameter that controls whether host regulation is turned on. Defaults to True","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Output Returns time series data in a SummarizedExperiment (SE) data container, which can be used for a variety of analyses. For details, see MicrobiomeAnalysis.jl","category":"page"},{"location":"readme/#Reproducibility","page":"Home","title":"Reproducibility","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"The functions in this package (apart from generic_run()) are stochastic, and therefore can lead to different results at different times. To ensure reproducibility, the stochastic functions all have a \"seed\" parameter, which can be used to initialize a specific instance of a random number generator which arrives at the same results every time.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Example:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"using MiCroSim\nmy_seed = 1234\nD, W_ba = create_metabolism(seed=my_seed)","category":"page"},{"location":"readme/#Design-your-own-metabolism","page":"Home","title":"Design your own metabolism","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"The best way to contribute to this project is by curating universal metabolisms in the form of stoichiometric and energy yield matrices. Admittedly, the reaction systems that may arise from create_metabolism() are limited, but more complex metabolic networks can also be implemented, for example modeling synthetic processes by setting energy yields negative (that is, a species invests into producing a metabolite). Furthermore, pathway databases such as KEGG coupled with microbial whole genome data open the possibility for deriving net conversions from real-world experiments.","category":"page"},{"location":"readme/#Acknowledgements","page":"Home","title":"Acknowledgements","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This project has benefited from contributions and insights of the following individuals and groups:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"István Scheuring and Gergely Boza from the Centre for Ecological Research, Budapest, provided essential theoretical guidance for the model's development.\nGiulio Benedetti and the TurkuDataScience team form the University of Turku, Turku, were instrumental in setting up and optimizing the Julia package.\nThe model was inspired by the work of Goldford et al. (2018).","category":"page"},{"location":"readme/#Funding","page":"Home","title":"Funding","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This project received funding from the European Union’s Horizon 2020 research and innovation programme (under grant agreement 952914; FindingPheno).","category":"page"},{"location":"readme/#Contact-me","page":"Home","title":"Contact me","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"For inquiries and bug reports, contact Jakab Máté: mate.jakab@ecolres.hu","category":"page"},{"location":"example2/#Just-some-text","page":"Tutorial 2","title":"Just some text","text":"","category":"section"},{"location":"example2/","page":"Tutorial 2","title":"Tutorial 2","text":"and here","category":"page"},{"location":"example1/#This-is-just-testing","page":"Tutorial 1","title":"This is just testing","text":"","category":"section"},{"location":"example1/","page":"Tutorial 1","title":"Tutorial 1","text":"and this too","category":"page"},{"location":"#Generate-a-universal-metabolism","page":"Manual","title":"Generate a universal metabolism","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"create_metabolism","category":"page"},{"location":"#MiCroSim.create_metabolism","page":"Manual","title":"MiCroSim.create_metabolism","text":"create_metabolism(; n_resources::Int64=10, n_levels::Int64=5, energy_yields::String=\"Uniform_1\", seed::Int64=1234)\n\nGenerates a universal metabolism\n\nOptional arguments\n\nn_resources::Int64: Number of possible resources in the system. Default is 10.\nn_levels::Int64: Number of levels of decomposition in the system. Default is 5.\nenergy_yields::String: The energy difference between two consecutive levels of decomposition. Default is 1 between all levels. Use \"Random\" to sample from a uniform distribution between 0 and 2 instead.\nrng::Int64: Random number generator seed. Default is 1234.\n\nOutput\n\nStoichiometric matrix, Energy yield matrix\n\n\n\n\n\n","category":"function"},{"location":"#Generate-some-species-by-sampling-from-all-possible-reactions","page":"Manual","title":"Generate some species by sampling from all possible reactions","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"create_species_pool","category":"page"},{"location":"#MiCroSim.create_species_pool","page":"Manual","title":"MiCroSim.create_species_pool","text":"create_species_pool(D::Matrix; n_families::Int64=5, family_size::Int64=100, dirichlet_hyper::Real=100, between_family_var::Real=0.1, inside_family_var::Real=0.05, h::Real=1, maintenance::Real=0.1, specialist::Real=1, generalist::Real=1, a_dist::Union{Distributions.Sampleable, Nothing}=nothing, k_dist::Union{Distributions.Sampleable, Nothing}=nothing, seed::Int64=1234)\n\nCreate a pool of species by sampling reactions from a matrix denoting all possible reactions.\n\nMandatory arguments\n\nD::Matrix: Matrix denoting all possible reactions. A square matrix whose size should be equal to the number of possible resources in the system. All reactions will be deemed possible whose values are non-zero.\n\nOptional arguments\n\nn_families::Int64: Number of families (groups of functionally similar species) in the species pool. Default is 5.\nfamily_size::Int64: Number of species in each family. Default is 100.\ndirichlet_hyper::Real: Hyperparameter for the Dirichlet distribution that is used for creating the species inside the same family. The higher its value, the more similar they will be. Default is 100.\nmaintenance::Real: The expected cost of maintenance accross all species. Default is 0.1.     \nbetween_family_var::Real: Variance of the normal distribution used to sample the maintenance values between families. Default is 0.1.\ninside_family_var::Real: Variance of the normal distribution used to sample the maintenance values inside families. Default is 0.05.\nh::Real: Controls the allocation of reaction rates inside species. Default is 1.\nspecialist::Real: The specialist part of the odds ratio specialists:generalists in the pool. Default is 1.\ngeneralist::Real: The generalist part of the odds ratio specialists:generalists in the pool. Default is 1.\na_dist::Union{Distributions.Sampleable, Nothing}: Distribution to sample the strength of host control. Default is Uniform(0.5, 1.5).\nk_dist::Union{Distributions.Sampleable, Nothing}: Distribution to sample the critical abundance that triggers host control. Default is Uniform(99.999, 100.001).\nrng::Int64: Random number generator seed. Default is 1234.\n\nOutput\n\nPoolStruct with the following fields:\n\npool::Array{Float64, 3}: The matrices describing the metabolisms of the species inside the species pool.\nfamily_ids::Array{Int64}: The family IDs of species\nm::Array{Float64}: The maintenance costs of the species\nn_reactions::Array{Int64}: The number of reactions of the species\nn_splits::Array{Float64}: Reaction repertoire complexity metric of the species\na::Array{Float64}: The strength of host control on the species\nk::Array{Float64}: The critical abundance that triggers host control on the species\n\n\n\n\n\n","category":"function"},{"location":"#Sample-species-from-species-pool","page":"Manual","title":"Sample species from species pool","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"sample_pool","category":"page"},{"location":"#MiCroSim.sample_pool","page":"Manual","title":"MiCroSim.sample_pool","text":"sample_pool(p::PoolStruct, n_species::Int64, n_invaders::Int64; seed::Int64=1234)\n\nSamples species from a species pool\n\nMandatory arguments\n\np::PoolStruct: A pool struct containing the pool of species.\nn_species::Int64: Number of species initially present in the habitat.\nn_invaders::Int64: Number of invading species.\n\nOptional arguments\n\nseed::Int64: Random number generator seed. Default is 1234.\n\nOutput\n\nSampleStruct with the following fields:\n\nn_species::Int64: Number of species initially present in the habitat.\nn_invaders::Int64: Number of invading species.\nC::Array{Float64, 3}: The matrices describing the metabolism of the sampled species.\nfamily_ids::Array{Int64}: The family IDs of the sampled species.\nm::Array{Float64}: The maintenance costs of the sampled species.\nn_reactions::Array{Int64}: The number of reactions of the sampled species.\nn_splits::Array{Float64}: Reaction repertoire complexity metric of the sampled species.\nspecies_abundance::Array{Float64}: The initial abundances of the sampled species.\nresource_abundance::Array{Float64}: The initial abundances of resources.\na::Array{Float64}: The strength of host control on the sampled species.\nk::Array{Float64}: The critical abundance that triggers host control on the sampled species.\n\n\n\n\n\n","category":"function"},{"location":"#Simulate-dynamics-based-on-the-sample","page":"Manual","title":"Simulate dynamics based on the sample","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"generic_run","category":"page"},{"location":"#MiCroSim.generic_run","page":"Manual","title":"MiCroSim.generic_run","text":"generic_run(sample::SampleStruct; D=nothing, W_ba=nothing, path=homedir(), t_span=(0, 1000), t_inv=25.0, t_inv_0=100.0, cutoff=0.0001, phi=0.1, eta=0.1, tau=nothing, alpha=nothing, plot=true, host_regulation=true)\n\nRun the model with the given parameters and sample by solving a set of ODEs using the KenCarp4 solver.\n\nMandatory arguments\n\nsample::SampleStruct: A sample struct containing the initial conditions and parameters for the model.\n\nRecommended but optional arguments\n\nD::Union{Nothing, AbstractMatrix}: The stoichiometric matrix for the model. If not supplied, a default matrix will be created.\nW_ba::Union{Nothing, AbstractMatrix}: The energy yield matrix for the model. If not supplied, a default matrix will be created.\npath::String: The path to save the output plots. Default is homedir().\nt_span::Tuple{Int64, Int64}: The time span for the simulation. Default is (0, 1000).\n\nOptional arguments\n\nt_inv::Float64: The time between the introduction of two subsequent invading species. Default is 25.0.\nt_inv_0::Float64: The time at which the first invading species is introduced. Default is 100.0.\ncutoff::Float64: The abundance threshold under which a species is considered extinct and its abundance is set to 0. Default is 0.0001.\nphi::Float64: The strength of the additional maintenance costs based on the complexity of a the reaction repertoires of species. Default is 0.1.\neta::Float64: The strength of the additional maintenance costs based on the number of reactions of species. Default is 0.1.\ntau::Union{Vector{Float64}, Nothing}: Controls the replenisment/depletion rates of resources from/into the outter environment. Default is 1.0 for all reasources.\nalpha::Union{Vector{Float64}, Nothing}: The availability of resources in the outer environment. Default is 100.0 for the first resource and 0.0 for the rest.\nplot::Bool: Whether to generate plots of the simulation. Default is true.\nhost_regulation::Bool: Whether to include host regulation in the model. Default is true.\n\n\n\n\n\n","category":"function"}]
}
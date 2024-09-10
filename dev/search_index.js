var documenterSearchIndex = {"docs":
[{"location":"readme/#Microbial-Cross-feeding-Community-Simulator","page":"Home","title":"Microbial Cross-feeding Community Simulator","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"(Image: Build Status)","category":"page"},{"location":"readme/#A-general-purpose-microbial-consumer-resource-model-that-outputs-simulated-data-in-the-SummarizedExperiment-(SE)-format.","page":"Home","title":"A general-purpose microbial consumer-resource model that outputs simulated data in the SummarizedExperiment (SE) format.","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This project offers a quick and easy method for simulating microbial community dynamics based solely on their metabolic interactions. The model represents distinct microbial species as matrices that describe their net conversion rates in the form A -> nB, where A is the metabolite consumed, B is the metabolite excreted into a shared environment, and n is a stoichiometric constant. Additionally, the species housing the above net conversion (or reaction), will have generated some value (energy) during the process, which contributes to its own growth. Once excreted, metabolite B may be utilized by a different species, enabling cross-feeding (syntrophy) between the populations present in the community. The model incorporates a feeding term that describes the type and amount of resources that flow into the system per unit time. All observed growth in the community can be derived from this inflow of resources: some species will be able to directly consume the resources flowing into the habitat (as a renewable or depletable resource), while the preferred resources for other species will be the byproducts of the reaction(s) performed by different species.","category":"page"},{"location":"readme/#Applicability","page":"Home","title":"Applicability","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"Simulate the growth of an initially populated microbial community and find the equilibrium abundances\nSimulate the succession of an initially empty microbial habitat where colonizers appear one by one\nSimulate the resilience of a microbial community against invaders appearing one by one","category":"page"},{"location":"readme/#Installation","page":"Home","title":"Installation","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"To install MiCroSim.jl directly from the github repository, use:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"using Pkg\nPkg.add(url=\"https://github.com/Jakab-Mate/MiCroSim.jl.git\")","category":"page"},{"location":"readme/#Workflow","page":"Home","title":"Workflow","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"The functions in this package rely on each other's outputs, so generally you will want to use them in the following order:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"create_metabolism(...)  Generates the set of possible reactions (net conversions), or in other words a universal metabolism. Each reaction is characterized by 4 attributes: the metabolite that is being consumed, the metabolite that is being produced, the stoichiometric constant (unit resource produced per unit resource consumed), and the energy that the species gains per unit resource consumed. \ncreate_metabolism() outputs two matrices that hold the stoichiometric constants and the energy gains respectively. Each of these matrices is of size RxR, where R is the number of different resources, and each entry inside them corresponds to a specific reaction, where the column index indicates the resource being consumed, and the row index indicates the resource being produced. Importantly, the positions of zeros in these two matrices must align, and those reactions will not be possible.\nTo simulate a gut-microbiome scenario, where most reactions are catabolic, create_metabolism() operates under the following assumptions:\nResources can be grouped into different levels of decomposition, based on their energy content\nReactions will always yield some energy, meaning that the resource produced will always be of a lower level (more decomposed) than the resource consumed\ncreate_species_pool(...)  Generates the pool of possible species by sampling from the possible reactions, a subset of which will be used for simulations later. The species pool consists of different families, whose members are functionally similar to each other. Family members will always possess the same set of reactions, with varied reaction rates. Each family has a \"prior\" or holotype, whose reaction rates are vectorized and used as the density parameter of a Dirichlet distribution. The reaction rates of family members are then sampled from this Dirichlet distribution. Families can either be specialist or generalist. Specialist families will have 2-3 reactions, while generalists will have 4-5. \nReturning to our gut-microbiome scenario, we have introduced host regulation, the extent of which we assume to be identical in the members of the same family. We make the assumption that when the population of a microbial species reaches a certain size, the host will recognize this species as a potential threat, and start regulating its growth. Regulation is imposed according to the following equation:\n(Image: formula2)\nwhere G_i is the growth rate of species i without host regulation, a controls the strength/speed of host regulation, k controls the critical population size and N_i is the population size of species i.\nsample_pool(...)  Chooses some species matrices from a pool and takes the corresponding subset of the attribute vectors. It also assigns initial abundances (values between 0 and 1) for the species in the sample and all of the different resources.\ngeneric_run(...)  Takes a sample and solves a set of Ordinary Differential Equations (ODEs) to simulate the community dynamics. Along with the sample there are several tradeoff-s and other parameters controlling the simulation, whose values can be set here. In order to better understand what these parameters do, let's look at the ODEs:\nSpecies dynamics is given by:\n(Image: formula3)\nwhere delta_w is the energy yield matrix C are the species matrices, R are the resource abundances, m are the default maintenance values, E are the complexity metrics, eta describes how the complexity metrics contribute to maintenance costs, F are the number of reactions, phi describes how the number of reactions contribute to maintenance costs and N are the species abundances.\nResource dynamics is as follows:\n(Image: formula4)\nwhere K are the inflow rates, tau are the dilution rates, D is the stoichiometric matrix and the rest of the parameters are the same as above. The first term describes the inflow and depletion of resources from and into an outer environment, the second (negative) term describes consumption and the last (positive) term describes production.\nspatial_run(...) is an alternative to generic_run, and is applicable in cases where the modeled habitat can be partitioned into local communities along some linear axis, such as the gut. The local communities interact with each other through abduction (unidirectional flow) and diffusion (bidirectional flow). These processes may affect species and resources at different rates, which the user can specify. The outer environment is assumed to be directly connected only to the first local community (as is the case in the gut), and thus, invaders and resource input will first appear here, but may spread to the subsequent local communities due to the aforementioned two processes.","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"Detailed instructions for using each function can be found in the Manual and Tutorial sections","category":"page"},{"location":"readme/#Design-your-own-metabolism","page":"Home","title":"Design your own metabolism","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"The best way to contribute to this project is by curating universal metabolisms in the form of stoichiometric and energy yield matrices. Admittedly, the reaction systems that may arise from create_metabolism() are limited, but more complex metabolic networks can also be implemented, for example modeling synthetic processes by setting energy yields negative (that is, a species invests into producing a metabolite). Furthermore, pathway databases such as KEGG coupled with microbial whole genome data open the possibility for deriving net conversions from real-world experiments.","category":"page"},{"location":"readme/#Acknowledgements","page":"Home","title":"Acknowledgements","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This project has benefited from contributions and insights of the following individuals and groups:","category":"page"},{"location":"readme/","page":"Home","title":"Home","text":"István Scheuring and Gergely Boza from the Centre for Ecological Research, Budapest, provided essential theoretical guidance for the model's development.\nLeo Lahti, Giulio Benedetti, Moein Khalighi and the rest of the TurkuDataScience team form the University of Turku, Turku, were instrumental in setting up and optimizing the Julia package. Perhaps more importantly, I would like to thank them for their hospitality throughout my secondment in Turku.\nThe model was inspired by the work of Goldford et al. (2018).","category":"page"},{"location":"readme/#Funding","page":"Home","title":"Funding","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"This project received funding from the European Union’s Horizon 2020 research and innovation programme (under grant agreement 952914; FindingPheno).","category":"page"},{"location":"readme/#Contact-me","page":"Home","title":"Contact me","text":"","category":"section"},{"location":"readme/","page":"Home","title":"Home","text":"For inquiries and bug reports, contact Jakab Máté: mate.jakab@ecolres.hu","category":"page"},{"location":"example4/#Simulate-spatial-dynamics","page":"-","title":"Simulate spatial dynamics","text":"","category":"section"},{"location":"example4/","page":"-","title":"-","text":"using MiCroSim\n\n# Create some metabolism\nD, W_ba = create_metabolism(n_resources=n_resources)\n\n# Create a species pool\npool = create_species_pool(D, n_families=5, family_size=10)\n\n# Draw a sample of 10 species and 10 invaders\nsample = sample_pool(pool, 10,  10)\n\n# Simulate dynamics of a network that is partitioned into 3 local communities\nout = spatial_run(3, sample, D=D, W_ba=W_ba, phi=0.1, eta=0.1, t_span=(0, 400), host_regulation=false)","category":"page"},{"location":"example2/#Introducing-colonizers-into-an-initially-empty-habitat","page":"Initially empty community","title":"Introducing colonizers into an initially empty habitat","text":"","category":"section"},{"location":"example2/","page":"Initially empty community","title":"Initially empty community","text":"using MiCroSim\n\nn_resources = 15\n# let's supply multiple resources extrenally this time\nsupplied_resources = 3\n\n# create vector of resource availabilities\nalpha = vcat(fill(100.0, supplied_resources), fill(0.0, n_resources - supplied_resources))\n\nD, W_ba = create_metabolism(n_resources=n_resources)\npool = create_species_pool(D)\n\n# start from an empty community, and add 50 species one by one\nsample = sample_pool(pool, 0,  40)\n\n# simulate dynamics using the given resource availability\nout = generic_run(sample, D=D, W_ba=W_ba, alpha=alpha, host_regulation=false, t_span=(0, 1200))\n\n#figures will now appear in homedir, since we didn't specify a path","category":"page"},{"location":"example2/","page":"Initially empty community","title":"Initially empty community","text":"The resulting species dynamics is illustrated below:","category":"page"},{"location":"example2/","page":"Initially empty community","title":"Initially empty community","text":"(Image: img3)","category":"page"},{"location":"example2/","page":"Initially empty community","title":"Initially empty community","text":"Above the changes in abundance, we also track some valueable information about the species present in the network such as number of reactions or complexity of reaction repertoires. This is enabled by the rowdata fields of the SummarizedExperiment output object, which is used to automatically create plots.","category":"page"},{"location":"example2/","page":"Initially empty community","title":"Initially empty community","text":"For example, the figure below shows the Metabolic Capacity Index representative of the community as the colonization progresses. This is calculated from the number of reactions that each species houses. These measures could be useful for relating the simulation results to real world experiments such as that of Marcos et al. (2023).","category":"page"},{"location":"example2/","page":"Initially empty community","title":"Initially empty community","text":"(Image: img4)","category":"page"},{"location":"example3/#Check-the-robustness-of-an-equilibrium-state-community-against-invaders","page":"Populated + invaders","title":"Check the robustness of an equilibrium state community against invaders","text":"","category":"section"},{"location":"example3/","page":"Populated + invaders","title":"Populated + invaders","text":"using MiCroSim\n\nn_resources = 16\nsupplied_resources = 2\nalpha = vcat(fill(100.0, supplied_resources), fill(0.0, n_resources - supplied_resources))\n\n# Create a metabolism with 8 levels of decomposition\nn_levels = 8 \nD, W_ba = create_metabolism(n_resources=n_resources, n_levels=n_levels)\n\npool = create_species_pool(D, n_families=10, family_size=20)\n\n# Start from a populated community, and add 80 invading species\nsample = sample_pool(pool, 20,  80)\n\n# Simulate dynamics of initial community until t=1000 and then start adding invaders \nout = generic_run(sample, D=D, W_ba=W_ba, alpha=alpha, t_inv=25.0, t_inv_0=1000.0, t_span=(0, 4000), host_regulation=false)","category":"page"},{"location":"example3/","page":"Populated + invaders","title":"Populated + invaders","text":"The fruitless efforts of invading species are best illustrated on the MCI plot. When invasion events stop, the community returns to the initial equilibrium state.","category":"page"},{"location":"example3/","page":"Populated + invaders","title":"Populated + invaders","text":"(Image: img5)","category":"page"},{"location":"example1/#Find-equilibrium-community-composition-of-initially-populated-community","page":"Initially populated community","title":"Find equilibrium community composition of initially populated community","text":"","category":"section"},{"location":"example1/","page":"Initially populated community","title":"Initially populated community","text":"using MiCroSim\n\nn_resources = 12 # set the number of resources\n\n# create universal metabolism of a 12 resource system\nD, W_ba = create_metabolism(n_resources=n_resources)\n\n# generate a pool of 5 families, each with 10 members\npool = create_species_pool(D, n_families=5, family_size=10)\n\n# sample 25 initially present species from the pool\nsample = sample_pool(pool, 25,  0)\n\n# simulate dynamics with host regulation turned off\nout = generic_run(sample, D=D, W_ba=W_ba, phi=0.0, t_span=(0, 200), host_regulation=false, path=\"full/path/to/output/folder/\")\n\n# since plot is set to true by default, you will find some figures illustrating your simulation results is your specified directory","category":"page"},{"location":"example1/","page":"Initially populated community","title":"Initially populated community","text":"Since there is no host regulation, and only a single summplied resource (default), only the species with the most favorable metabolic profile survives, as illustrated on the plot below:","category":"page"},{"location":"example1/","page":"Initially populated community","title":"Initially populated community","text":"(Image: img1)","category":"page"},{"location":"example1/","page":"Initially populated community","title":"Initially populated community","text":"With host regulation enabled, multiple species can survive:","category":"page"},{"location":"example1/","page":"Initially populated community","title":"Initially populated community","text":"(Image: img2)","category":"page"},{"location":"example1/","page":"Initially populated community","title":"Initially populated community","text":"Although in this case, we might want to midify t_span becasue it takes longer to reach the equilibrium state","category":"page"},{"location":"#Reproducibility","page":"Manual","title":"Reproducibility","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"The functions in this package (apart from generic_run()) are stochastic, and therefore can lead to different results at different times. To ensure reproducibility, the stochastic functions all have a \"seed\" parameter, which can be used to initialize a specific instance of a random number generator which arrives at the same results every time.","category":"page"},{"location":"","page":"Manual","title":"Manual","text":"Example:","category":"page"},{"location":"","page":"Manual","title":"Manual","text":"using MiCroSim\nmy_seed = 1234\nD, W_ba = create_metabolism(seed=my_seed)","category":"page"},{"location":"#Create-a-metabolism","page":"Manual","title":"Create a metabolism","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"create_metabolism","category":"page"},{"location":"#MiCroSim.create_metabolism","page":"Manual","title":"MiCroSim.create_metabolism","text":"create_metabolism(; n_resources::Int64=10, n_levels::Int64=5, energy_yields::String=\"Uniform_1\", seed::Int64=1234)\n\nGenerates a universal metabolism\n\nOptional arguments\n\nn_resources::Int64: Number of possible resources in the system. Default is 10.\nn_levels::Int64: Number of levels of decomposition in the system. Default is 5.\nenergy_yields::String: The energy difference between two consecutive levels of decomposition. Default is 1 between all levels. Use \"Random\" to sample from a uniform distribution between 0 and 2 instead.\nrng::Int64: Random number generator seed. Default is 1234.\n\nOutput\n\nStoichiometric matrix, Energy yield matrix\n\n\n\n\n\n","category":"function"},{"location":"#Create-a-species-pool","page":"Manual","title":"Create a species pool","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"create_species_pool","category":"page"},{"location":"#MiCroSim.create_species_pool","page":"Manual","title":"MiCroSim.create_species_pool","text":"create_species_pool(D::Matrix; n_families::Int64=5, family_size::Int64=100, dirichlet_hyper::Real=100, between_family_var::Real=0.1, inside_family_var::Real=0.05, h::Real=1, maintenance::Real=0.1, specialist::Real=1, generalist::Real=1, a_dist::Union{Distributions.Sampleable, Nothing}=nothing, k_dist::Union{Distributions.Sampleable, Nothing}=nothing, seed::Int64=1234)\n\nCreate a pool of species by sampling reactions from a matrix denoting all possible reactions.\n\nMandatory arguments\n\nD::Matrix: Matrix denoting all possible reactions. A square matrix whose size should be equal to the number of possible resources in the system. All reactions will be deemed possible whose values are non-zero.\n\nOptional arguments\n\nn_families::Int64: Number of families (groups of functionally similar species) in the species pool. Default is 5.\nfamily_size::Int64: Number of species in each family. Default is 100.\ndirichlet_hyper::Real: Hyperparameter for the Dirichlet distribution that is used for creating the species inside the same family. The higher its value, the more similar they will be. Default is 100.\nmaintenance::Real: The expected cost of maintenance accross all species. Default is 0.1.     \nbetween_family_var::Real: Variance of the normal distribution used to sample the maintenance values between families. Default is 0.1.\ninside_family_var::Real: Variance of the normal distribution used to sample the maintenance values inside families. Default is 0.05.\nh::Real: Controls the allocation of reaction rates inside species. Default is 1.\nspecialist::Real: The specialist part of the odds ratio specialists:generalists in the pool. Default is 1.\ngeneralist::Real: The generalist part of the odds ratio specialists:generalists in the pool. Default is 1.\na_dist::Union{Distributions.Sampleable, Nothing}: Distribution to sample the strength of host control. Default is Uniform(0.5, 1.5).\nk_dist::Union{Distributions.Sampleable, Nothing}: Distribution to sample the critical abundance that triggers host control. Default is Uniform(99.999, 100.001).\nrng::Int64: Random number generator seed. Default is 1234.\n\nOutput\n\nPoolStruct with the following fields:\n\npool::Array{Float64, 3}: The matrices describing the metabolisms of the species inside the species pool.\nfamily_ids::Array{Int64}: The family IDs of species\nm::Array{Float64}: The maintenance costs of the species\nn_reactions::Array{Int64}: The number of reactions of the species\nn_splits::Array{Float64}: Reaction repertoire complexity metric of the species\na::Array{Float64}: The strength of host control on the species\nk::Array{Float64}: The critical abundance that triggers host control on the species\n\n\n\n\n\n","category":"function"},{"location":"#Sample-a-species-pool","page":"Manual","title":"Sample a species pool","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"sample_pool","category":"page"},{"location":"#MiCroSim.sample_pool","page":"Manual","title":"MiCroSim.sample_pool","text":"sample_pool(p::PoolStruct, n_species::Int64, n_invaders::Int64; seed::Int64=1234)\n\nSamples species from a species pool\n\nMandatory arguments\n\np::PoolStruct: A pool struct containing the pool of species.\nn_species::Int64: Number of species initially present in the habitat.\nn_invaders::Int64: Number of invading species.\n\nOptional arguments\n\nseed::Int64: Random number generator seed. Default is 1234.\nn_comms::Int64: Number of communities. Default is 1.\nph::Bool: Whether to sample pH values. If true, optimal pH value is sampled from the (0, 14) range for each species. \n\nDefault is false, where optimal pH is set to 7.0 for all species.\n\nOutput\n\nSampleStruct with the following fields:\n\nn_species::Int64: Number of species initially present in the habitat.\nn_invaders::Int64: Number of invading species.\nC::Array{Float64, 3}: The matrices describing the metabolism of the sampled species.\nfamily_ids::Array{Int64}: The family IDs of the sampled species.\nm::Array{Float64}: The maintenance costs of the sampled species.\nn_reactions::Array{Int64}: The number of reactions of the sampled species.\nn_splits::Array{Float64}: Reaction repertoire complexity metric of the sampled species.\nspecies_abundance::Array{Float64}: The initial abundances of the sampled species.\nresource_abundance::Array{Float64}: The initial abundances of resources.\na::Array{Float64}: The strength of host control on the sampled species.\nk::Array{Float64}: The critical abundance that triggers host control on the sampled species.\n\n\n\n\n\n","category":"function"},{"location":"#Simulate-dynamics-using-the-sample","page":"Manual","title":"Simulate dynamics using the sample","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"generic_run","category":"page"},{"location":"#MiCroSim.generic_run","page":"Manual","title":"MiCroSim.generic_run","text":"generic_run(sample::SampleStruct;\n D=nothing,\n W_ba=nothing,\n path=homedir(),\n t_span=(0, 1000),\n t_inv=25.0,\n t_inv_0=100.0,\n cutoff=0.0001,\n phi=0.1,\n eta=0.1,\n tau=nothing,\n alpha=nothing,\n plot=true,\n host_regulation=true)\n\nRun the model with the given parameters and sample by solving a set of ODEs using the KenCarp4 solver.\n\nMandatory arguments\n\nsample::SampleStruct: A sample struct containing the initial conditions and parameters for the model.\n\nRecommended but optional arguments\n\nD::Union{Nothing, Matrix{Int64}}: The stoichiometric matrix for the model. If not supplied, a default matrix will be created.\nW_ba::Union{Nothing, Matrix{Float64}}: The energy yield matrix for the model. If not supplied, a default matrix will be created.\npath::String: The path to save the output plots. Default is homedir().\nt_span::Tuple{Int64, Int64}: The time span for the simulation. Default is (0, 1000).\n\nOptional arguments\n\nt_inv::Float64: The time between the introduction of two subsequent invading species. Default is 25.0.\nt_inv_0::Float64: The time at which the first invading species is introduced. Default is 100.0.\ncutoff::Float64: The abundance threshold under which a species is considered extinct and its abundance is set to 0. Default is 0.0001.\nphi::Float64: The strength of the additional maintenance costs based on the complexity of a the reaction repertoires of species. Default is 0.1.\neta::Float64: The strength of the additional maintenance costs based on the number of reactions of species. Default is 0.1.\ntau::Union{Vector{Float64}, Nothing}: Controls the replenisment/depletion rates of resources from/into the outter environment. Default is 1.0 for all reasources.\nalpha::Union{Vector{Float64}, Nothing}: The availability of resources in the outer environment. Default is 100.0 for the first resource and 0.0 for the rest.\nplot::Bool: Whether to generate plots of the simulation. Default is true.\nhost_regulation::Bool: Whether to include host regulation in the model. Default is true.\n\nOutput\n\nReturns time series data in a SummarizedExperiment (SE) data container, which can be used for a variety of analyses. For details, see MicrobiomeAnalysis.jl\n\n\n\n\n\n","category":"function"},{"location":"#Simulate-spatial-dynamics","page":"Manual","title":"Simulate spatial dynamics","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"spatial_run","category":"page"},{"location":"#MiCroSim.spatial_run","page":"Manual","title":"MiCroSim.spatial_run","text":"spatial_run(n_comms::Int64, sample::SampleStruct;\nD_species=0.1,\nD_resources=0.1,\nA_species=0.1,\nA_resources=0.1,\nD=nothing,\nW_ba=nothing,\npath=homedir(),\nt_span=(0, 1000),\nt_inv=25.0,\nt_inv_0=100.0,\ncutoff=0.0001,\nphi=0.1,\neta=0.1,\ntau=nothing,\nalpha=nothing,\nplot=true,\nhost_regulation=true)\n\nRun the spatially extended version of the model, where a set of communities are simulated. The communities resemble different sections of the gut, where resources and invaders appear in the first community and can spread to the other communities through diffusion and advection.\n\nMandatory arguments\n\nn_comms::Int64: The number of communities to simulate.\nsample::SampleStruct: A sample struct containing the initial conditions and parameters for the model.\n\nAdditional arguments\n\nD_species::Float64: The diffusion coefficient for species. Default is 0.1.\nD_resources::Float64: The diffusion coefficient for resources. Default is 0.1.\nA_species::Float64: The advection coefficient for species. Default is 0.1.\nA_resources::Float64: The advection coefficient for resources. Default is 0.1.\nph_list::Union{Nothing, Vector{Float64}}: A list of pH values for each community. If not supplied, the default pH value is 7.0.\n\nOutput\n\nReturns a dictionary of SummarizedExperiment (SE) data containers\n\n\n\n\n\n","category":"function"},{"location":"#Structs","page":"Manual","title":"Structs","text":"","category":"section"},{"location":"","page":"Manual","title":"Manual","text":"If you wish to use the structures PoolStruct or SampleStruct, you will need to specify the module name as well, since these are not exported:","category":"page"},{"location":"","page":"Manual","title":"Manual","text":"MiCroSim.PoolStruct()\nMiCroSim.SampleStruct()","category":"page"}]
}

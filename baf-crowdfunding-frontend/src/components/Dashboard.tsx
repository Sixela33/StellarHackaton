import React, { useState } from "react";
import { 
  Heart, 
  Search,
  Filter,
  Share2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import CreateCampaign from "./CreateCampaign";
import ConnectButton from "./Button";
import { Button } from "@/components/ui/button";

// shadcn/ui components
// import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProvider } from "@/providers/Provider";
import { walletService } from "@/service/wallet.service";
import { shortenAddress } from "@/utils/shorten-address";

interface Campaign {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  supporters: number;
  status: 'active' | 'funded' | 'completed';
  milestones: Milestone[];
  category: string;
  image: string;
  daysLeft: number;
  location?: string;
  urgency?: 'low' | 'medium' | 'high';
  organizer: string;
  featured?: boolean;
  tags: string[];
  story: string;
  updates: Update[];
}

interface Milestone {
  id: number;
  title: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  evidence: string;
  dueDate: string;
}

interface Update {
  id: number;
  title: string;
  content: string;
  date: string;
  author: string;
}


interface User {
  totalInvested: number;
  activeInvestments: number;
  avatar: string;
  name: string;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User>({
    totalInvested: 0,
    activeInvestments: 0,
    avatar: '/api/placeholder/100/100',
    name: 'John Doe'
  });
  
  if(user) {
    console.log("si")
  }
  
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 1,
      title: "Help Sarah Beat Cancer",
      description: "Sarah is fighting stage 3 breast cancer and needs your support for treatment. Every donation brings hope and healing.",
      goal: 50000,
      raised: 42350,
      supporters: 1247,
      status: 'active',
      category: 'Medical',
      image: './sarah.webp',
      daysLeft: 8,
      location: 'New York, NY',
      urgency: 'high',
      organizer: 'Sarah Johnson',
      featured: true,
      tags: ['Medical', 'Cancer', 'Treatment', 'Urgent'],
      story: "Sarah is a 34-year-old mother of two who was diagnosed with stage 3 breast cancer in January 2024. She's been fighting bravely but needs financial support for her treatment plan.",
      milestones: [
        { id: 1, title: 'Initial Treatment', amount: 25000, status: 'approved', evidence: 'Treatment started', dueDate: '2024-03-15' },
        { id: 2, title: 'Surgery', amount: 15000, status: 'pending', evidence: 'Scheduled', dueDate: '2024-04-01' },
        { id: 3, title: 'Recovery Support', amount: 10000, status: 'pending', evidence: 'Planned', dueDate: '2024-05-01' }
      ],
      updates: [
        { id: 1, title: 'Treatment Progress', content: 'Sarah has completed her first round of chemotherapy and is responding well to treatment.', date: '2024-03-10', author: 'Sarah Johnson' },
        { id: 2, title: 'Surgery Scheduled', content: 'We have scheduled Sarah\'s surgery for April 1st. Thank you for all your support!', date: '2024-03-08', author: 'Sarah Johnson' }
      ]
    },
    {
      id: 2,
      title: "Rebuild After Hurricane Maria",
      description: "Our community in Puerto Rico needs help rebuilding homes and schools destroyed by the hurricane.",
      goal: 75000,
      raised: 75000,
      supporters: 2156,
      status: 'funded',
      category: 'Disaster Relief',
      image: './hurricane_maria.jpg',
      daysLeft: 0,
      location: 'Puerto Rico',
      urgency: 'medium',
      organizer: 'Community Foundation',
      featured: true,
      tags: ['Disaster Relief', 'Hurricane', 'Rebuilding', 'Community'],
      story: "Hurricane Maria devastated our community in 2017, destroying homes, schools, and infrastructure. We're working to rebuild stronger than ever.",
      milestones: [
        { id: 1, title: 'Emergency Relief', amount: 30000, status: 'approved', evidence: 'Completed', dueDate: '2024-02-01' },
        { id: 2, title: 'Home Rebuilding', amount: 30000, status: 'approved', evidence: 'Completed', dueDate: '2024-02-15' },
        { id: 3, title: 'School Reconstruction', amount: 15000, status: 'pending', evidence: 'In progress', dueDate: '2024-04-01' }
      ],
      updates: [
        { id: 1, title: 'Homes Rebuilt', content: 'We have successfully rebuilt 15 homes for families affected by the hurricane.', date: '2024-02-15', author: 'Community Foundation' },
        { id: 2, title: 'School Progress', content: 'Construction on the new school building is 60% complete.', date: '2024-03-01', author: 'Community Foundation' }
      ]
    },
    {
      id: 3,
      title: "Save the Local Animal Shelter",
      description: "Our beloved animal shelter is at risk of closing. Help us keep our doors open for animals in need.",
      goal: 25000,
      raised: 18750,
      supporters: 892,
      status: 'active',
      category: 'Animals',
      image: './animal_shelter.webp',
      daysLeft: 15,
      location: 'Austin, TX',
      urgency: 'medium',
      organizer: 'Paws & Hearts Rescue',
      featured: false,
      tags: ['Animals', 'Shelter', 'Rescue', 'Community'],
      story: "Our animal shelter has been serving the Austin community for over 20 years, but rising costs threaten our ability to continue helping animals in need.",
      milestones: [
        { id: 1, title: 'Rent Payment', amount: 15000, status: 'approved', evidence: 'Paid', dueDate: '2024-03-01' },
        { id: 2, title: 'Medical Supplies', amount: 7500, status: 'pending', evidence: 'Ordered', dueDate: '2024-03-20' },
        { id: 3, title: 'Staff Salaries', amount: 2500, status: 'pending', evidence: 'Scheduled', dueDate: '2024-04-01' }
      ],
      updates: [
        { id: 1, title: 'Rent Secured', content: 'Thanks to your generous donations, we have secured our shelter location for another year!', date: '2024-03-01', author: 'Paws & Hearts Rescue' }
      ]
    },
    {
      id: 4,
      title: "Clean Water for Rural Village",
      description: "Building a clean water system for a village of 500 people who currently walk miles for contaminated water.",
      goal: 35000,
      raised: 28400,
      supporters: 634,
      status: 'active',
      category: 'Community',
      image: './contaminated_village.webp',
      daysLeft: 22,
      location: 'Kenya',
      urgency: 'medium',
      organizer: 'Water for All',
      featured: false,
      tags: ['Community', 'Water', 'Infrastructure', 'Africa'],
      story: "In rural Kenya, access to clean water is a daily challenge. This project will provide sustainable water access for an entire village.",
      milestones: [
        { id: 1, title: 'Well Drilling', amount: 20000, status: 'approved', evidence: 'Completed', dueDate: '2024-02-20' },
        { id: 2, title: 'Pump Installation', amount: 10000, status: 'pending', evidence: 'In progress', dueDate: '2024-03-25' },
        { id: 3, title: 'Distribution System', amount: 5000, status: 'pending', evidence: 'Planned', dueDate: '2024-04-10' }
      ],
      updates: [
        { id: 1, title: 'Well Completed', content: 'The well drilling has been completed successfully! Water quality tests are excellent.', date: '2024-02-20', author: 'Water for All' }
      ]
    }
  ]);

  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('featured');
  const { currentAccount, setCurrentAccount } = useProvider();

  const handleConnectWallet = async () => {
    try {
      const address = await walletService.connect();
      console.log("Connected wallet address:", address);
      localStorage.setItem("wallet", address);
      setCurrentAccount(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const handleInvest = (campaignId: number, amount: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId 
        ? { ...campaign, raised: campaign.raised + amount, supporters: campaign.supporters + 1 }
        : campaign
    ));
    setUser(prev => ({ 
      ...prev, 
      totalInvested: prev.totalInvested + amount,
      activeInvestments: prev.activeInvestments + 1
    }));
    setShowInvestModal(false);
  };

  const handleCreateCampaign = (campaignData: any) => {
    const newCampaign: Campaign = {
      id: Date.now(),
      title: campaignData.title,
      description: campaignData.description,
      goal: campaignData.goal,
      raised: 0,
      supporters: 0,
      status: 'active',
      category: campaignData.category,
      image: campaignData.image || '/api/placeholder/600/400',
      daysLeft: 30,
      location: 'Global',
      urgency: 'medium',
      organizer: 'You',
      featured: false,
      tags: [campaignData.category],
      story: campaignData.description,
      milestones: campaignData.milestones.map((m: any) => ({
        id: m.id,
        title: m.title,
        amount: m.amount,
        status: 'pending' as const,
        evidence: m.evidence,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      })),
      updates: []
    };
    
    setCampaigns(prev => [newCampaign, ...prev]);
    setShowCreateCampaign(false);
  };

  const getProgressPercentage = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const categories = ['all', 'Medical', 'Disaster Relief', 'Animals', 'Community', 'Education', 'Environment'];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredCampaigns = filteredCampaigns.filter(c => c.featured);
  const regularCampaigns = filteredCampaigns.filter(c => !c.featured);

  return (
    <div className="min-h-screen bg-[#fac141]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-sm">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-transparent flex items-center justify-center">
              <div className="text-2xl">💫</div>
            </div>
            <span className="hidden sm:inline-block font-bold text-xl text-[#fac141]">
              Impulsar
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a href="#" className="transition-colors hover:text-white text-white">Discover</a>
              <a href="#" className="transition-colors hover:text-white text-white">How it Works</a>
              <a href="#" className="transition-colors hover:text-white text-white">About</a>
            </nav>
            
            <ConnectButton
              name={
                currentAccount ? shortenAddress(currentAccount) : "Connect Wallet"
              }
              color="yellow"
              handleOnClick={handleConnectWallet}
            />
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">


        {/* Hero Section */}
        <div className="mb-12 sm:mb-16 text-center">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="mb-4 sm:mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Fund the causes that
              <span className="block text-white">
                matter most
              </span>
            </h1>
            <p className="mb-6 sm:mb-8 text-lg sm:text-xl text-white/80 max-w-3xl mx-auto">
              Join millions of people helping people. Start your fundraising journey today and make a real difference in the world.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 sm:space-x-4">
              <Button 
                onClick={() => setShowCreateCampaign(true)} 
                size="lg" 
                className="bg-black hover:bg-black/85 h-12 px-6 sm:px-8 text-lg text-white w-full sm:w-auto"
              >
                Start a Campaign
              </Button>
              <Button variant="outline" size="lg" className="h-12 px-6 sm:px-8 text-lg w-full sm:w-auto">
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 sm:mb-12">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white" />
              <Input
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black text-white placeholder:text-white/60 w-full"
              />
            </div>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-[180px] bg-black border-white/20 text-white">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" className="hidden md:flex">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Campaign Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
          <TabsList className="grid w-full grid-cols-3 gap-2">
            <TabsTrigger value="featured" className="text-white bg-black p-2 rounded-lg">Featured</TabsTrigger>
            <TabsTrigger value="all" className="text-white bg-black p-2 rounded-lg">All Campaigns</TabsTrigger>
            <TabsTrigger value="trending" className="text-white bg-black p-2 rounded-lg">Trending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="featured" className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full">
              {featuredCampaigns.map((campaign) => (
                <Card key={campaign.id} className="group overflow-hidden transition-all duration-300 hover:shadow-xl bg-black border-0 text-white">
                  <div className="relative">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title}
                      className="h-48 sm:h-56 lg:h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4">
                      <Badge className="bg-[#fac141] text-white">FEATURED</Badge>
                    </div>
                    <div className="absolute right-4 top-4">
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                      <div className="text-white">
                        <p className="text-sm font-medium">{campaign.organizer}</p>
                        <h3 className="text-xl font-bold">{campaign.title}</h3>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 sm:p-6">
                  <p className="mb-6 text-white/80">{campaign.description}</p>
                    
                    {/* Progress */}
                    <div className="mb-6">
                      <div className="mb-3 flex justify-between text-sm">
                        <span className="font-medium">Progress</span>
                        <span className="font-bold text-[#fac141]">
                          {getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(campaign.raised, campaign.goal)} className="h-3 bg-white/20" />
                    </div>
                    
                    {/* Stats */}
                    <div className="mb-6 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-[#fac141]">{formatCurrency(campaign.raised)}</p>
                        <p className="text-xs text-white/60">raised of {formatCurrency(campaign.goal)}</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{formatNumber(campaign.supporters)}</p>
                        <p className="text-xs text-white/60">supporters</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{campaign.daysLeft}</p>
                        <p className="text-xs text-white/60">days left</p>
                      </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="mb-6 flex flex-wrap gap-2">
                      {campaign.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    {/* Action */}
                    <Button 
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowInvestModal(true);
                      }}
                      className="w-full bg-[#fac141] hover:bg-[#f0b030]"
                    >
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="all" className="space-y-6 sm:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {regularCampaigns.map((campaign) => (
                <Card key={campaign.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg bg-black border-0 text-white">
                  <div className="relative">
                    <img 
                      src={campaign.image} 
                      alt={campaign.title}
                      className="h-40 sm:h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <Badge variant="secondary" className="text-xs">
                        {campaign.category}
                      </Badge>
                    </div>
                    <div className="absolute right-3 top-3">
                      <Button variant="secondary" size="icon" className="h-8 w-8 rounded-full">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4 sm:p-5">
                  <p className="mb-2 text-sm text-white/80">{campaign.organizer}</p>
                    <h4 className="mb-3 text-lg font-bold line-clamp-2 text-white">{campaign.title}</h4>
                    
                    {/* Progress */}
                    <div className="mb-4">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="text-white/80">{getProgressPercentage(campaign.raised, campaign.goal).toFixed(0)}%</span>
                        <span className="font-semibold text-white">{formatCurrency(campaign.raised)}</span>
                      </div>
                      <Progress value={getProgressPercentage(campaign.raised, campaign.goal)} className="h-2" />
                    </div>
                    
                    <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
                      <span>{campaign.daysLeft} days left</span>
                      <span>{formatNumber(campaign.supporters)} supporters</span>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setSelectedCampaign(campaign);
                        setShowInvestModal(true);
                      }}
                      className="w-full bg-[#fac141] hover:bg-[#f0b030]"
                    >
                      Support This Cause
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-8">
            <div className="text-center text-muted-foreground">
              <TrendingUp className="mx-auto mb-4 h-12 w-12" />
              <h3 className="text-lg font-semibold">Trending campaigns will appear here</h3>
              <p>Based on engagement, funding progress, and community interest</p>
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Stats */}
        <Card className="mb-12 sm:mb-16 bg-black border-0 text-white">
  <CardContent className="p-8 sm:p-12 text-center">
    <h3 className="mb-4 text-3xl sm:text-4xl font-bold text-white">Join our community of changemakers</h3>
    <div className="mb-6 text-6xl sm:text-7xl lg:text-8xl font-bold text-[#fac141]">2.4M+</div>
    <p className="mb-8 text-lg sm:text-xl text-white/80">People have donated to causes they care about</p>
    <Button size="lg" className="bg-white text-black hover:bg-gray-100 h-12 px-6 sm:px-8 text-lg">
      Start Making a Difference
    </Button>
  </CardContent>
</Card>

        {/* How It Works */}
        <div className="mb-12 sm:mb-16">
        <h3 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold text-white">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
            <div className="text-center">
              <div className="mx-auto mb-4 sm:mb-6 h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-black flex items-center justify-center">
                <Sparkles className="h-8 sm:h-10 w-8 sm:w-10 text-white" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-white bg-black p-2 rounded-lg">Start Your Campaign</h4>
              <p className="text-black/80 text-xl sm:text-base font-bold">Share your story and set your fundraising goal</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-black flex items-center justify-center">
                <Share2 className="h-10 w-10 text-white" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-white bg-black p-2 rounded-lg">Share with Friends</h4>
              <p className="text-black/80 text-lg font-bold">Spread the word on social media and email</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-black flex items-center justify-center">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h4 className="mb-3 text-xl font-bold text-white bg-black p-2 rounded-lg">Receive Donations</h4>
              <p className="text-black/80 text-lg font-bold">Get funds directly to your bank account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Modal */}
      <Dialog open={showInvestModal} onOpenChange={setShowInvestModal}>
      <DialogContent className="w-[90vw] max-w-md bg-black border-0 text-white">
  <DialogHeader>
    <DialogTitle className="text-white">Support {selectedCampaign?.title}</DialogTitle>
    <DialogDescription className="text-white/80">
      Make a donation to help this cause reach its goal.
    </DialogDescription>
  </DialogHeader>
  <div className="space-y-6">
    <div>
      <label className="text-sm font-medium text-white">Donation Amount</label>
      <div className="relative mt-2">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-white/60">$</span>
        <Input
          type="number"
          min="1"
          className="pl-8 text-lg bg-gray-800 border-gray-700 text-white"
          placeholder="Enter amount"
        />
      </div>
    </div>
  </div>
  <DialogFooter className="flex space-x-2">
    <Button variant="outline" onClick={() => setShowInvestModal(false)} className="border-white text-white hover:bg-white hover:text-black">
      Cancel
    </Button>
    <Button 
      onClick={() => selectedCampaign && handleInvest(selectedCampaign.id, 1000)}
      className="bg-[#fac141] hover:bg-[#f0b030] text-black"
    >
      Donate Now
    </Button>
  </DialogFooter>
</DialogContent>
      </Dialog>

      {/* Create Campaign Modal */}
      {showCreateCampaign && (
        <CreateCampaign
          onClose={() => setShowCreateCampaign(false)}
          onSubmit={handleCreateCampaign}
        />
      )}
    </div>
  );
};

export default Dashboard; 
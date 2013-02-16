"use strict";

function Segment() {
   //type: Segment
   //The segment that precedes this one
   this.prevSegment = null;

   //type: Segment
   //The segment that succeeds this one
   this.nextSegment = null;

   //Type: Array (of Segments)
   //Contains the root segments of the branches connected to this Segment.
   this.branches = [];

   //Type: float
   //The length of this segment in distance units
   this.segmentLength = 1;

   //Type: float (radians)
   //The angle of this segment's rotation along the X/Y axis
   this.angle = 0;

   //Type: float (radians)
   //The angle of this segment's rotation along the local Z axis
   this.direction = 0;
}

function SegmentParameters() {
   //Type: float
   //The minimum and maximum lengths of a segment to use
   //when generating a new segment
   this.minSegmentLength = 1;
   this.maxSegmentLength = 1;

   //Type: float (radians)
   //The minimum and maximum values of a segment's angle
   //when generating a new segment
   this.minSegmentAngle = 0;
   this.maxSegmentAngle = 0;

   //Type: int
   //The minimum and maxiumum amount of branches to have on this segment
   this.minNumBranches = 0;
   this.maxNumBranches = 0;

   //Type: int
   //This value represents how many segments are left to be generated
   //along this particular length of tree.
   this.segments = 0;

   //Type: float
   //When generating a branch, the the min and max values of the branch's length
   //will be multiplied by this value.
   this.branchLengthFactor = 1;

   //Type: float
   //When generating a branch, the min and max value of the branch's angle will be 
   //multiplied by this factor
   this.branchAngleFactor = 1;

   //Type: float
   //When generating a branch, the number of segments in the branch will be taken
   //from it's root and multiplied by this factor.
   this.branchSegmentFactor = 1;

   //Type: float
   //When generating a branch, the number of branches branching out from that branch
   //Will be multiplied by this factor.
   this.branchBranchFactor = 1;
}

//Generates a random value between min and max (inclusive)
function randomRange(min, max)
{
   return min + Math.random() * (max - min);
}

//Parameters:
//--root--
//Type: Segment
//The generated segment will stem from this segment
//--params--
//Type: SegmentParameters
//The values to use when generating this Segment
function generateSegment(root, params)
{
   var segment = new Segment();
   segment.previousSegment = root;
   segment.segmentLength = randomRange(params.minSegmentLength, params.maxSegmentLength);
   segment.angle = randomRange(params.minSegmentAngle, params.maxSegmentAngle);
   segment.direction = Math.random() * Math.PI * 2;

   var numBranches = Math.floor(randomRange(params.minNumBranches, params.maxNumBranches));
   var branchParams = branchSegmentParams(params);
   for (var i = 0; i < numBranches; i++)
   {
      var branch = generateSegment(segment, branchParams);
      segment.branches.push(branch);
   }

   if (params.segments > 1)
   {
      //params.segments -= 1;
      segment.nextSegment = generateSegment(segment, branchParams);
   }

   return segment;
}

//Creates a new SegmentParameters object
//by shrinking the min and max values of the
//given SegmentParameters object by the factors specified
//in that object.
//Parameters:
//--params--
//Type: SegmentParameters
//The input SegmentParameters object that will have its values
//shrunk
function branchSegmentParams(params)
{
   var sp2 = new SegmentParameters();
   sp2.minSegmentLength = params.minSegmentLength * params.branchLengthFactor;
   sp2.maxSegmentLength = params.maxSegmentLength * params.branchLengthFactor;

   sp2.minSegmentAngle = params.minSegmentAngle * params.branchAngleFactor;
   sp2.maxSegmentAngle = params.maxSegmentAngle * params.branchAngleFactor;

   sp2.minNumBranches = Math.floor(params.minNumBranches * params.branchBranchFactor);
   sp2.maxNumBranches = Math.floor(params.maxNumBranches * params.branchBranchFactor);

   sp2.segments = Math.floor(params.segments * params.branchSegmentFactor);
   sp2.segments -= 1;

   return sp2;
}
